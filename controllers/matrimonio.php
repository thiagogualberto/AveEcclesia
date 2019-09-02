<?php
use Sistema\Models\{Matrimonio, Membro};
use \HtmlPDF\HtmlPDF;
use Sistema\Date;

const serialize = [
	'delegate' => ['noivo_mae', 'noivo_pai', 'noiva_mae', 'noiva_pai', 'noivo_mae', 'noivo_pai', 'noiva_mae', 'noiva_pai']
];

// GET /api/matrimonio
function matrimonio_list($req, $res)
{
	try {

		$paroquia_id = $req->user->paroquia_id;
		$sort = '`'.$req->query('sort', 'id').'`';
		$order = $req->query('order', 'desc');
		$filter = 'mat.`'.$req->query('filter', 'noivo_nome').'`';
		$search = $req->query('search', '');
		$limit = $req->query('limit', 10);
		$offset = $req->query('offset', 0);

		$count = Matrimonio::find_by_sql(
			"SELECT COUNT(mat.id) total FROM matrimonios mat
			LEFT JOIN membros noivo ON noivo.pessoa_id = mat.noivo_id
			LEFT JOIN membros noiva ON noiva.pessoa_id = mat.noiva_id
			WHERE mat.paroquia_id = ? AND $filter LIKE ?",
			[ $paroquia_id, "%$search%" ]
		)->to_array()[0]['total'];

		$result = Matrimonio::find_by_sql(
			"SELECT mat.*, noivo.pai noivo_pai, noivo.mae noivo_mae, noiva.pai noiva_pai, noiva.mae noiva_mae FROM matrimonios mat
			LEFT JOIN membros noivo ON noivo.pessoa_id = mat.noivo_id
			LEFT JOIN membros noiva ON noiva.pessoa_id = mat.noiva_id
			WHERE mat.paroquia_id = ? AND $filter LIKE ?
			ORDER BY $sort $order
			LIMIT $offset, $limit",
			[ $paroquia_id, "%$search%" ]
		)->to_array();

		$res->json([
			'total' => $count,
			'rows' => $result
		]);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/matrimonio/membros
function membros_matrimonio_list($req, $res)
{
	try {

		$paroquia_id = $req->user->paroquia_id;
		$search = $req->query('search', '');
		$sexo = $req->query('sexo', '');

		$result = Membro::find_by_sql("CALL obter_membros_nao_casados(?, ?, ?)", [$paroquia_id, $search, $sexo]);
		$res->json([
			'success' => true,
			'rows' => $result->to_array()
		]);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/matrimonio/:id
function matrimonio_get($req, $res)
{
	try {

		$matrimonio = Matrimonio::find_by_sql(
			'SELECT mat.*, noivo.pai noivo_pai, noivo.mae noivo_mae, noiva.pai noiva_pai, noiva.mae noiva_mae FROM matrimonios mat
			LEFT JOIN membros noivo ON noivo.pessoa_id = mat.noivo_id
			LEFT JOIN membros noiva ON noiva.pessoa_id = mat.noiva_id
			WHERE mat.id = ?',
			[ $req->params->id ]
		);

		if ($matrimonio) {
			$res->json($matrimonio->to_array(serialize)[0]);
		} else {
			throw new Exception('Registro com id='.$req->params->id.' não encontrado', 1);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// PUT /api/matrimonio/:id
function matrimonio_put($req, $res)
{
	try {

		$data = $req->body;

		// Atualiza o matrimonio
		$matrimonio = Matrimonio::find($req->params->id);
		$result = $matrimonio->update_attributes($data);

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Registro atualizado com sucesso!',
				'data' => $matrimonio->to_array()
			]);
		} else {
			$res->json(['success' => false, 'message' => 'Registro com id='.$req->params->id.' não encontrado!']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/matrimonio
function matrimonio_post($req, $res)
{
	try {

		$data = $req->body;

		// Elimina matrimônio repetido
		if ($mat = Matrimonio::find_by_noivo_id_or_noiva_id($data->noivo_id, $data->noiva_id)) {
			if ($mat->noivo_id == $data->noivo_id) {
				throw new Exception('O noivo '.$data->noivo_nome.' já tem um matrimônio em seu nome!');			
			} else if ($mat->noiva_id == $data->noiva_id) {
				throw new Exception('A noiva '.$data->noiva_nome.' já tem um matrimônio em seu nome!');			
			}
		}

		// Atualiza o matrimonio
		$mat = new Matrimonio($data);
		$mat->paroquia_id = $req->user->paroquia_id;
		$result = $mat->save();

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Matrimônio adicionado com sucesso!',
				'data' => $mat->to_array()
			]);
		} else {
			throw new Exception('Erro ao inserir o matrimônio! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/matrimonio/:id
function matrimonio_delete($req, $res)
{
	try {

		$mat = Matrimonio::find($req->params->id);
		$mat->delete();

		$res->json(['success' => true, 'message' => 'Matrimônio excluído com sucesso!']);

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// GET /api/matrimonio/:id/certidao
function matrimonio_certidao($req, $res)
{
	try {

		$paroquia = $req->user->paroquia;
	
		$mat = Matrimonio::find($req->params->id);
		$noivo = $mat->noivo;
		$noiva = $mat->noiva;
		$batismo_noivo = $noivo->batismo;
		$batismo_noiva = $noiva->batismo;
		$dt_hoje = new \DateTime;

		$pdf = new HtmlPDF('src/template/certidao/matrimonio.html');

		// Header e footer da certidão
		$pdf->set([
			'paroquia_nome' => $paroquia->nome,
			'cnpj' => $paroquia->cnpj,
			'endereco' => $paroquia->endereco,
			'bairro' => $paroquia->bairro,
			'cep' => $paroquia->cep,
			'cidade' => $paroquia->cidade,
			'uf' => $paroquia->uf,
			'datetime' => $dt_hoje->format('d/m/Y \- H:i:s'),
			'usuario' => $req->user->nome
		]);

		// Corpo
		$pdf->set([
			'dt_casamento' => Date::toFullString($mat->dt_casamento),
			'noivo_nome' => mb_strtoupper($mat->noivo_nome),
			'noiva_nome' => mb_strtoupper($mat->noiva_nome),
			'noivo_estado_civil' => $noivo->nmestado_civil ?? 'solteiro',
			'noiva_estado_civil' => $noiva->nmestado_civil ?? 'solteira',
			'noivo_pai' => $noivo->pai,
			'noivo_mae' => $noivo->mae,
			'noiva_pai' => $noiva->pai,
			'noiva_mae' => $noiva->mae,
			'data' => Date::toFullString(),
			'noivo_dt_nascimento' => Date::toString($noivo->dt_nascimento),
			'noiva_dt_nascimento' => Date::toString($noiva->dt_nascimento),
			'noivo_dt_batismo' => exec_safe('Sistema\Date::toString', $batismo_noivo, 'dt_batismo'),
			'noiva_dt_batismo' => exec_safe('Sistema\Date::toString', $batismo_noiva, 'dt_batismo'),
			'noivo_batismo_paroquia' => _get($batismo_noivo, 'paroquia'),
			'noiva_batismo_paroquia' => _get($batismo_noiva, 'paroquia')
		]);

		$pdf->set($mat->to_array(serialize));
		$pdf->output();

	} catch (Exception $e) {
		$res->send($e->getMessage());
	}
}

// GET /api/matrimonio/:id/processo
function matrimonio_processo($req, $res)
{
	try {

		$mat = Matrimonio::find($req->params->id);
		$noivo = $mat->noivo;
		$noiva = $mat->noiva;
		$batismo_noivo = $noivo->batismo;
		$batismo_noiva = $noiva->batismo;

		$paroquia = $req->user->paroquia;
		$matrimonio = $mat->to_array(serialize);
	
		$pdf = new HtmlPDF('src/template/certidao/processo_matrimonial.html');
		
		// Header da certidão
		$pdf->set([
			'paroquia_nome' => $paroquia->nome,
			'cnpj' => $paroquia->cnpj,
			'endereco' => $paroquia->endereco,
			'bairro' => $paroquia->bairro,
			'cep' => $paroquia->cep,
			'cidade' => $paroquia->cidade,
			'uf' => $paroquia->uf,
		]);

		$pdf->set([
			'dt_casamento' => Date::toFullString($mat->dt_casamento),
			'proclamas1' =>  Date::toFullString($mat->proclamas1),
			'proclamas2' =>  Date::toFullString($mat->proclamas2),
			'proclamas3' =>  Date::toFullString($mat->proclamas3),
			'dt_curso' =>  Date::toFullString($mat->dt_curso),
			'hr_casamento' => preg_replace('/(\d{2}:\d{2}).*/', '$1h', $mat->hr_casamento)
		]);

		// Dados do noivo
		$pdf->set([
			'noivo_dt_nascimento' => exec_safe('Sistema\Date::toString', $noivo, 'dt_nascimento'),
			'noivo_idade' => exec_safe('Sistema\Date::age', $noivo, 'dt_nascimento'),
			'noivo_cpf_cnpj' => $noivo->cpf_cnpj,
			'noivo_rg' => $noivo->rg,
			'noivo_sexo' => $noivo->sexo,
			'noivo_tel' => $noivo->tel,
			'noivo_cel' => $noivo->cel,
			'noivo_estado_civil' => $noivo->nmestado_civil,
			'noivo_dt_batismo' => exec_safe('Sistema\Date::toString', $batismo_noivo, 'dt_batismo'),
			'noivo_batismo_livro' => _get($batismo_noivo, 'livro'),
			'noivo_batismo_folha' => _get($batismo_noivo, 'folha'),
			'noivo_batismo_registro' => _get($batismo_noivo, 'registro'),
			'noivo_batismo_paroquia' => _get($batismo_noivo, 'paroquia'),
			'q1a' => $mat->q1a ?? '-',
			'q2a' => $mat->q2a_name,
			'q3a' => $mat->q3a ?? '-',
			'q4a' => $mat->q4b_name,
			'q5a' => $mat->q5a ?? 'sim',
			'q6a' => $mat->q6a ?? 'sim',
			'q7a' => $mat->q7a ?? 'sim',
			'q8a' => $mat->q8a ?? 'não',
			'q9a' => $mat->q9a ?? '-',
			'q10a' => $mat->q10a ?? 'não',
			'q11a' => $mat->q11a ?? '-',
			'q12a' => $mat->q12a ?? '-',
			'q13a' => $mat->q13a ?? '-',
			'q14a' => $mat->q14a ?? 'sim',
			]);

		// Dados da noiva
		$pdf->set([
			'noiva_dt_nascimento' => Date::toString($noiva->dt_nascimento),
			'noiva_idade' => Date::age($noiva->dt_nascimento),
			'noiva_cpf_cnpj' => $noiva->cpf_cnpj,
			'noiva_rg' => $noiva->rg,
			'noiva_sexo' => $noiva->sexo,
			'noiva_tel' => $noiva->tel,
			'noiva_cel' => $noiva->cel,
			'noiva_estado_civil' => $noiva->nmestado_civil,
			'noiva_dt_batismo' => exec_safe('Sistema\Date::toString', $batismo_noiva, 'dt_batismo'),
			'noiva_batismo_livro' => _get($batismo_noiva, 'livro'),
			'noiva_batismo_folha' => _get($batismo_noiva, 'folha'),
			'noiva_batismo_registro' => _get($batismo_noiva, 'registro'),
			'noiva_batismo_paroquia' => _get($batismo_noiva, 'paroquia'),
			'q1b' => $mat->q1b ?? '-',
			'q2b' => $mat->q2b_name,
			'q3b' => $mat->q3b ?? '-',
			'q4b' => $mat->q4b_name,
			'q5b' => $mat->q5b ?? 'sim',
			'q6b' => $mat->q6b ?? 'sim',
			'q7b' => $mat->q7b ?? 'sim',
			'q8b' => $mat->q8b ?? 'não',
			'q9b' => $mat->q9b ?? '-',
			'q10b' => $mat->q10b ?? 'não',
			'q11b' => $mat->q11b ?? '-',
			'q12b' => $mat->q12b ?? '-',
			'q13b' => $mat->q13b ?? '-',
			'q14b' => $mat->q14b ?? 'sim',
		]);

		$pdf->set(prefix_array('noivo', $noivo));
		$pdf->set(prefix_array('noiva', $noiva));
		$pdf->set(prefix_array('noivo_batismo', $batismo_noivo));
		$pdf->set(prefix_array('noiva_batismo', $batismo_noiva));
		$pdf->set($matrimonio);
	
		// Footer
		$pdf->set([
			'datetime' => date('d/m/Y \- H:i:s'),
			'usuario' => $req->user->nome
		]);
	
		// $pdf->show();
		$pdf->output();

	} catch (Exception $e) {
		$res->send($e->getMessage());
	}
}

// GET /api/matrimonio/:id/lembranca
function matrimonio_lembranca($req, $res)
{
	try {

		$paroquia = $req->user->paroquia;

		$mat = Matrimonio::find($req->params->id);
		$noivo = $mat->noivo;
		$noiva = $mat->noiva;

		$pdf = new HtmlPDF('src/template/lembranca/lembranca_matrimonio.html');

		// Header e footer
		$pdf->set([
			'paroquia_nome' => $paroquia->nome,
			'cnpj' => $paroquia->cnpj,
			'endereco' => $paroquia->endereco,
			'bairro' => $paroquia->bairro,
			'cep' => $paroquia->cep,
			'cidade' => $paroquia->cidade,
			'uf' => $paroquia->uf,
			'datetime' => date('d/m/Y \- H:i:s'),
			'usuario' => $req->user->nome
		]);

		$pdf->set([
			'dt_casamento' => Date::toFullString($mat->dt_casamento),
			'local_casamento' => $mat->local_casamento,
			'celebrante' => $mat->celebrante,
			'celebrante' => $mat->celebrante,
			'testemunha1' => $mat->testemunha1,
			'testemunha2' => $mat->testemunha2,
			'noivo_nome' => $mat->noivo_nome,
			'noiva_nome' => $mat->noiva_nome,
			'noivo_pai' => $noivo->pai,
			'noivo_mae' => $noivo->mae,
			'noiva_pai' => $noiva->pai,
			'noiva_mae' => $noiva->mae,
			'idade_noivo' => Date::age($noivo->dt_nascimento),
			'idade_noiva' => Date::age($noiva->dt_nascimento),
			'noivo_batismo_paroquia' => $noivo->batismo->paroquia,
			'noiva_batismo_paroquia' => $noiva->batismo->paroquia,
			'paroco' => $paroquia->responsavel
		]);

		$pdf->output();

	} catch (Exception $e) {
		$res->send($e->getMessage());
	}
}

// GET /api/matrimonio/notificacao
function matrimonio_notificacao($req, $res)
{
	try {

		$membro_id = $req->query('quem', 'noivo').'_id';

		$mat = Matrimonio::find($req->query->id);
		$membro = $mat->membro($membro_id);
		$conjuge = $mat->conjuge($membro_id);
		
		$paroquia = $req->user->paroquia;
		$batismo = $membro->batismo;

		$pdf = new HtmlPDF('src/template/lembranca/notificacao_matrimonio.html');

		// Header e footer
		$pdf->set([
			'paroquia_nome' => $paroquia->nome,
			'cnpj' => $paroquia->cnpj,
			'endereco' => $paroquia->endereco,
			'bairro' => $paroquia->bairro,
			'cep' => $paroquia->cep,
			'cidade' => $paroquia->cidade,
			'uf' => $paroquia->uf,
			'datetime' => date('d/m/Y \- H:i:s'),
			'usuario' => $req->user->nome
		]);

		$pdf->set([
			'dt_hoje' => Date::toFullString(),
			'dt_casamento' => Date::toFullString($mat->dt_casamento),
			'local_casamento' => $mat->local_casamento,
			'nome' => $membro->nome,
			'conjuge' => $conjuge->nome,
			'pai' => $membro->pai,
			'mae' => $membro->mae,
			'livro' => $batismo->livro,
			'folha' => $batismo->folha,
			'registro' => $batismo->registro,
			'paroquia_destino' => $req->query('paroquia'),
			'diocese_destino' => $req->query('diocese'),
			'cidade_destino' => $req->query('cidade')
		]);

		$pdf->output();

	} catch (Exception $e) {
		$res->send($e->getMessage());
	}
}

function _get(&$obj, $key) {
	return isset($obj->$key) ? $obj->$key : null;
}

function exec_safe($func, &$obj, $key) {
	return isset($obj->$key) ? $func($obj->$key) : null;
}

function prefix_array(string $prefix, $obj)
{
	if ($obj instanceof ActiveRecord\Model) {
		$obj = $obj->to_array();
	} else if (is_null($obj)) {
		return [];
	}

	$arr = [];

	foreach ($obj as $key => $value) {
		$arr[$prefix.'_'.$key] = $value;
	}

	return $arr;
}

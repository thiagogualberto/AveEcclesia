<?php
use Sistema\Models\{Batismo, Membro};
use Sistema\Date;

// GET /api/batismo
function batismo_list($req, $res)
{
	try {

		$paroquia_id = $req->user->paroquia_id;
		$sort = '`'.$req->query('sort', 'id').'`';
		$order = $req->query('order', 'desc');
		$filter = '`'.$req->query('filter', 'nome_batismo').'`';
		$search = $req->query('search', '');
		$limit = $req->query('limit', 10);
		$offset = $req->query('offset', 0);

		// Caso o filtro seja nome_batismo, então busca pelo nome do membro também
		if ($filter == '`nome_batismo`') {
			$where = "WHERE bat.paroquia_id = ? AND (nome_batismo LIKE ? || nome LIKE ?)";
			$values = [ $paroquia_id, "%$search%", "%$search%" ];
		} else {
			$where = "WHERE bat.paroquia_id = ? AND $filter LIKE ?";
			$values = [ $paroquia_id, "%$search%" ];
		}

		$count = Batismo::find_by_sql(
			"SELECT COUNT(bat.id) total FROM batismos bat
			LEFT JOIN pessoas pes ON bat.pessoa_id = pes.id
			LEFT JOIN membros mem ON bat.pessoa_id = mem.pessoa_id
			$where",
			$values
		)->to_array()[0]['total'];

		$result = Batismo::find_by_sql(
			"SELECT bat.*, nome, mae, pai FROM batismos bat
			LEFT JOIN pessoas pes ON bat.pessoa_id = pes.id
			LEFT JOIN membros mem ON bat.pessoa_id = mem.pessoa_id
			$where ORDER BY $sort $order LIMIT $offset, $limit",
			$values
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

// GET /api/batismo/membros
function membros_batismo_list($req, $res)
{
	try {

		$paroquia_id = $req->user->paroquia_id;
		$search = $req->query('search', '');

		$result = Membro::find_by_sql("CALL obter_membros_nao_batizado(?, ?)", [$paroquia_id, $search]);
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

// GET /api/batismo/:id
function batismo_get($req, $res)
{
	try {

		$batismo = Batismo::find($req->params->id);
		$res->json($batismo->to_array(['include' => 'pessoa']));

	} catch (Exception $e) {
		$res->json(['success' => false, 'exception' => $e->getMessage()]);
	}
}

// PUT /api/batismo/:id
function batismo_put($req, $res)
{
	try {

		// Atualiza o batizado
		$batismo = Batismo::find($req->params->id);
		$result = $batismo->update_attributes($req->body);

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Registro atualizado com sucesso!',
				'data' => $batismo->to_array()
			]);
		} else {
			$res->json(['success' => false, 'message' => 'Registro com id='.$req->params->id.' não encontrado!']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/batismo
function batismo_post($req, $res)
{
	try {

		// Dados do formulario
		$dados = $req->body;

		if (Batismo::exists(['conditions' => ['pessoa_id = ?', $dados->pessoa_id]])) {
			throw new Exception('O membro já possui batismo!');
		}

		$batismo = new Batismo($dados);
		$batismo->paroquia_id = $req->user->paroquia_id;
		$result = $batismo->save();

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Batismo adicionado com sucesso!',
				'data' => $batismo->to_array()
			]);
		} else {
			throw new Exception('Erro ao inserir o batismo! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/batismo/:id
function batismo_delete($req, $res)
{
	$batismo = Batismo::find($req->params->id);
	$batismo->delete();

	$res->json(['success' => true, 'message' => 'Registro excluído com sucesso']);
}

// GET /api/batismo/:id/certidao
function batismo_certidao($req, $res)
{
	try {

		$batismo = Batismo::find($req->params->id);
		$membro = Membro::find_by_pessoa_id($batismo->pessoa_id);

		$pessoa = $batismo->pessoa;
		$paroquia = $req->user->paroquia;
		$dt_batismo = $batismo->dt_batismo->format('Y-m-d');

		// Objeto de pdf
		$pdf = new \HtmlPDF\HtmlPDF('src/template/certidao/batismo.html');

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

		// Corpo
		$pdf->set([
			'livro' => $batismo->livro,
			'folha' => $batismo->folha,
			'registro' => $batismo->registro,
			'nome' => $pessoa->nome,
			'dt_nascimento' => Date::toString($pessoa->dt_nascimento),
			'dt_batismo' => Date::toFullString($batismo->dt_batismo),
			'dt_hoje' => Date::toFullString(),
			'pai' => $membro->pai,
			'mae' => $membro->mae,
			'padrinho' => $batismo->padrinho,
			'madrinha' => $batismo->madrinha,
			'celebrante' => $batismo->celebrante,
			'obs' => $batismo->obs
		]);

		// Footer
		$pdf->set([
			'datetime' => date('d/m/Y \- H:i:s'),
			'usuario' => $req->user->nome
		]);

		// Mostra o pdf
		$pdf->output();

	} catch (Exception $e) {
		$res->send($e->getMessage());
	}
}

// GET /api/batismo/:id/lembranca
function batismo_lembranca($req, $res)
{
	try {

		$batismo = Batismo::find($req->params->id);
		$membro = Membro::find_by_pessoa_id($batismo->pessoa_id);

		$pessoa = $batismo->pessoa;
		$paroquia = $req->user->paroquia;

		// Objeto de pdf
		$pdf = new \HtmlPDF\HtmlPDF('src/template/lembranca/lembranca_batismo.html');

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

		// Corpo
		$pdf->set([
			'nome' => $batismo->nome_batismo,
			'dt_batismo' => Date::toFullString($batismo->dt_batismo),
			'dt_nascimento' => Date::toFullString($pessoa->dt_nascimento),
			'pai' => $membro->pai,
			'mae' => $membro->mae,
			'padrinho' => $batismo->padrinho,
			'madrinha' => $batismo->madrinha,
			'celebrante' => $batismo->celebrante
		]);

		// Footer
		$pdf->set([
			'datetime' => date('d/m/Y \- H:i:s'),
			'usuario' => $req->user->nome
		]);

		// Mostra o pdf
		$pdf->output();

	} catch (Exception $e) {
		$res->send($e->getMessage());
	}

}

function locale_month($locale, $date)
{
	$date = is_string($date) ? strtotime($date) : $date;
	$num = intval(date('m', $date));
	$meses = [];

	switch ($locale) {
		case 'pt-BR':
			$meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
		default:
			break;
	}

	return $meses[$num-1];
}

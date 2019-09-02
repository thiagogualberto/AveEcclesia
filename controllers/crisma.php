<?php
use Sistema\Models\{Crisma, Membro};
use Sistema\Date;

// GET /api/crisma
function crisma_list($req, $res)
{
	try {

		$options = [
			'sort' => preg_replace('/(\w+)\.(.*)/', '$2', $req->query('sort', 'nome')),
			'filter' => $req->query('filter', 'nome'),
			'joins' => [
				'pessoa',
				'LEFT JOIN membros ON(crismas.pessoa_id = membros.pessoa_id)'
			],
			'select' => 'crismas.*, nome, mae, pai'
		];

		$result = Crisma::filter($req, $options);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/crisma/membros
function membros_crisma_list($req, $res)
{
	try {

		$paroquia_id = $req->user->paroquia_id;
		$search = $req->query('search', '');

		$result = Membro::find_by_sql("CALL obter_membros_nao_crismado(?, ?)", [$paroquia_id, $search]);
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

// GET /api/crisma/:id
function crisma_get($req, $res)
{
	try {
		
		$crisma = Crisma::find($req->params->id/*, ['joins' => ['pessoa'], 'select' => 'crismas.*, nome']*/);	
		$res->json($crisma->to_array(['include' => 'pessoa']));

	} catch (Exception $e) {
		$res->send('<pre>'.$e->getMessage().'</pre>');
	}
}

// PUT /api/crisma/:id
function crisma_put($req, $res)
{
	try {

		// Atualiza o batizado
		$crisma = Crisma::find($req->params->id);
		$result = $crisma->update_attributes($req->body);

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Registro atualizado com sucesso!',
				'data' => $crisma->to_array()
			]);
		} else {
			throw new Exception('Registro com id='.$req->params->id.' não encontrado!');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/crisma
function crisma_post($req, $res)
{
	try {

		$crisma = new Crisma($req->body);
		$crisma->paroquia_id = $req->user->paroquia_id;
		$result = $crisma->save();

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Crisma adicionada com sucesso!',
				'data' => $crisma->to_array()
			]);
		} else {
			throw new Exception('Erro ao inserir a crisma! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/crisma/:id
function crisma_delete($req, $res)
{
	$crisma = Crisma::find($req->params->id);
	$crisma->delete();

	$res->json(['success' => true, 'message' => 'Registro excluído com sucesso']);
}

// GET /api/crisma/:id/certidao
function crisma_certidao($req, $res)
{
	try {

		$crisma   = Crisma::find($req->params->id);
		$membro   = Membro::find_by_pessoa_id($crisma->pessoa_id);
		$dt_hoje  = new \DateTime;	
		$pessoa   = $crisma->pessoa;
		$paroquia = $req->user->paroquia;

		// Objeto de pdf
		$pdf = new \HtmlPDF\HtmlPDF('src/template/certidao/crisma.html');

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
			'livro' => $crisma->livro,
			'folha' => $crisma->folha,
			'registro' => $crisma->registro,
			'dt_nascimento' => Date::toString($pessoa->dt_nascimento),
			'nome' => $pessoa->nome,
			'pai' => $membro->pai,
			'mae' => $membro->mae,
			'padrinho' => $crisma->padrinho,
			'madrinha' => $crisma->madrinha,
			'dt_crisma' => Date::toFullString($crisma->dt_crisma),
			'dt_hoje' => Date::toFullString($dt_hoje),
			'celebrante' => $crisma->celebrante
		]);

		// Footer
		$pdf->set([
			'datetime' => $dt_hoje->format('d/m/Y \- H:i:s'),
			'usuario' => $req->user->nome
		]);

		// Mostra o pdf
		$pdf->output();

	} catch (Exception $e) {
		$res->send($e->getMessage());
	}
}

// GET /api/crisma/:id/lembranca
function crisma_lembranca($req, $res)
{
	try {

		$crisma = Crisma::find($req->params->id);
		$membro = Membro::find_by_pessoa_id($crisma->pessoa_id);

		$pessoa = $crisma->pessoa;
		$paroquia = $req->user->paroquia;

		// Objeto de pdf
		$pdf = new \HtmlPDF\HtmlPDF('src/template/lembranca/lembranca_crisma.html');

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
			'nome' => $crisma->pessoa->nome,
			'dt_crisma' => Date::toFullString($crisma->dt_crisma),
			'dt_nascimento' => Date::toFullString($pessoa->dt_nascimento),
			'local_crisma' => $crisma->paroquia,
			'pai' => $membro->pai,
			'mae' => $membro->mae,
			'padrinho' => $crisma->padrinho,
			'madrinha' => $crisma->madrinha,
			'celebrante' => $crisma->celebrante
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

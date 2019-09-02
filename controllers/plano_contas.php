<?php
use Sistema\Models\PlanoContas;

const serialize = [
	// 'delegate' => ['pessoa_nome', 'categoria_descricao']
];

// GET /api/plano-contas
function plano_contas_list($req, $res)
{
	try {

		$search = $req->query('search');
		$options = [
			'conditions' => [
				'diocese_id = ? AND descricao LIKE ?',
				$req->user->paroquia->diocese_id,
				"%$search%"
			]
		];

		$result = PlanoContas::all()->to_array();

		$res->json([
			'total' => count($result),
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

// GET /api/plano-contas/receitas
function plano_contas_receitas($req, $res)
{
	try {

		$search = $req->query('search');
		$options = [
			'conditions' => [
				"diocese_id = ? AND analitica = 0 AND grupo = 'R' AND descricao LIKE ?",
				$req->user->paroquia->diocese_id,
				"%$search%"
			]
		];

		$result = PlanoContas::all($options)->to_array();

		$res->json([
			'total' => count($result),
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

// GET /api/plano-contas/despesas
function plano_contas_despesas($req, $res)
{
	try {

		$search = $req->query('search');
		$options = [
			'conditions' => [
				"diocese_id = ? AND analitica = 0 AND grupo = 'D' AND descricao LIKE ?",
				$req->user->paroquia->diocese_id,
				"%$search%"
			]
		];

		$result = PlanoContas::all($options)->to_array();

		$res->json([
			'total' => count($result),
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

// GET /api/plano-contas/:id
function plano_contas_get($req, $res)
{
	try {
		
		$plano = PlanoContas::find($req->params->id);
		$res->json($plano->to_array(serialize));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/plano-contas/:id
function plano_contas_put($req, $res)
{
	$plano = PlanoContas::find($req->params->id);
	$result = $plano->update_attributes($req->body);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Plano de contas atualizado com sucesso', 'data' => $plano->to_array(serialize)]);
	} else {
		$res->json(['success' => false, 'message' => 'Plano de contas com id='.$req->params->id.' não encontrado!']);
	}
}

// POST /api/plano-contas
function plano_contas_post($req, $res)
{
	try {

		$plano = new PlanoContas($req->body);
		$result = $plano->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!', 'data' => $plano->to_array(serialize)]);
		} else {
			$res->json(['success' => false, 'message' => 'Erro ao inserir registro! Tente novamente mais tarde.']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/plano-contas/:id
function receita_delete($req, $res)
{
	$plano = PlanoContas::find($req->params->id);
	$result = $plano->delete();

	if ($result) {
		$res->json(['success' => true, 'message' => 'Plano de contas excluído com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Plano de contas com id='.$req->params->id.' não encontrado!']);
	}
}

// DELETE /api/plano-contas?ids=1,2,3
function plano_contas_delete($req, $res)
{
	$ids = explode(',', $req->query->ids);
	$result = PlanoContas::table()->delete(['id' => $ids]);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Planos de contas excluídos com sucesso', 'data' => ['id' => $ids]]);
	} else {
		$res->json(['success' => false, 'message' => 'Plano de contas com id='.$req->params->id.' não encontrado!']);
	}
}

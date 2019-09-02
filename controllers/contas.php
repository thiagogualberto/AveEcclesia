<?php
use Sistema\Models\Conta;

// GET /api/contas
function contas_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'id'),
			'filter' => $req->query('filter', 'nome'),
			'conditions' => ['paroquia_id = ?', $req->user->paroquia_id],
			'select' => '*, obter_vl_receitas(id) - obter_vl_despesas(id) saldo'
		];

		$result = Conta::filter($req, $options);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/contas/:id
function contas_get($req, $res)
{
	try {
		
		$receita = Conta::find([
			'conditions' => ['contas.id = ?', $req->params->id],
			'select' => '*',
			'joins' => ['pessoa']
		]);
	
		$res->json($receita->to_array(['include' => 'pessoa']));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/contas/:id
function contas_put($req, $res)
{
	$receita = Conta::find($req->params->id);
	$result = $receita->update_attributes($req->body);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Conta atualizado com sucesso', 'data' => $receita->to_array()]);
	} else {
		$res->json(['success' => false, 'message' => 'Conta com id='.$req->params->id.' não encontrado!']);
	}
}

// POST /api/contas
function contas_post($req, $res)
{
	try {

		$receita = new Conta($req->body);
		$receita->paroquia_id = $req->user->paroquia_id;
		$result = $receita->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!', 'data' => $receita->to_array()]);
		} else {
			$res->json(['success' => false, 'message' => 'Erro ao inserir registro! Tente novamente mais tarde.']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/contas/:id
function contas_delete($req, $res)
{
	$receita = Conta::find($req->params->id);
	$result = $receita->delete();

	if ($result) {
		$res->json(['success' => true, 'message' => 'Conta apagado com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Conta com id='.$req->params->id.' não encontrado!']);
	}
}

function resumo_mensal($req, $res)
{
	try {
		
		$params = [
			$req->user->paroquia_id,
			date('Y-m-01', time()),
			date('Y-m-t', time()),
		];
	
		$resumo = Conta::find_by_sql('CALL obter_resumo_periodo(?, ?, ?)', $params);
		$result = $resumo->to_array();
	
		function parse_float($item) {
			return floatval($item);
		}
	
		$res->json (
			array_map('parse_float', $result[0])
		);

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

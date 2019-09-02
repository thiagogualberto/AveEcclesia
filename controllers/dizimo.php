<?php
use Sistema\Models\Dizimo;

// GET /api/dizimo
function dizimo_list($req, $res)
{
	try {

		$search = $req->query('search');
		$filter = $req->query('filter', 'nome');
		$sort = $req->query('sort', 'dt_pagamento');

		$options = [
			'sort' => $sort,
			'filter' => $filter,
			'conditions' => ["plano_contas = ? and quitado = 1", $req->user->paroquia->dizimo_id],
			'joins' => ['pessoa'],
			'select' => 'pessoas.nome pessoa_nome, receitas.*'
		];

		$result = Dizimo::filter($req, $options);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/dizimo/:id
function dizimo_get($req, $res)
{
	try {

		$dizimo = Dizimo::find($req->params->id);
		
		if ($dizimo) {
			$res->json($dizimo->to_array());
		} else {
			throw new Exception('Dízimo não encontrado!');
		}
		
	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// PUT /api/dizimo/:id
function dizimo_put($req, $res)
{
	try {

		// Define as variáveis
		$data = $req->body;
		$data->valor = $data->pago;

		unset($data->num_parcelas);
		unset($data->repetir);
		
		// Atualiza o dizimo
		$dizimo = Dizimo::find($req->params->id);
		$result = $dizimo->update_attributes($data);

		if ($result) {
			$res->json(['success' => true, 'message' => 'Dízimo atualizado com sucesso!']);
		} else {
			throw new Exception('Registro com id='.$req->params->id.' não encontrado!');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/dizimo
function dizimo_post($req, $res)
{
	try {
		
		$body = $req->body; // Temp data
		$num_parcelas = $req->body->num_parcelas ?? 1; // Número de parcelas
		$periodo = $req->body->periodo ?? 'M'; // Número de parcelas
		$data = []; // Final array

		// Cria as parcelas, definindo a data de referência
		for ($i=0; $i < $num_parcelas; $i++)
		{
			$data[] = [
				'quitado' => 1,
				'descricao' => 'Dízimo',
				'pago' => $body->pago,
				'valor' => $body->pago,
				'periodo' => $periodo,
				'parcela' => sprintf('%02d/%02d', $i+1, $num_parcelas),
				'conta_id' => $req->user->paroquia->conta_id,
				'pessoa_id' => $body->pessoa_id,
				'paroquia_id' => $req->user->paroquia_id,
				'plano_contas' => $req->user->paroquia->dizimo_id,
				'dt_pagamento' => $body->dt_pagamento,
				'dt_vencimento' => parcel_period($body->dt_vencimento, $i, $periodo),
			];
		}
		
		// Insere um por um no banco
		foreach ($data as $item)
		{
			if ($dizimo = Dizimo::create($item)) {
				continue;
			} else {
				throw new Exception('Erro ao inserir registro! Tente novamente mais tarde.');
			}
		}

		// Se chegar até aqui, resultado positivo
		$res->json(['success' => true, 'message' => 'Dizimo adicionado com sucesso!']);
		
	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/dizimo/:id
function dizimo_delete($req, $res)
{
	try {

		$dizimo = Dizimo::find($req->params->id);

		if ($dizimo->delete()) {
			$res->json(['success' => true, 'message' => 'Dízimo excluído com sucesso']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

function parcel_period($initial, $step, $periodo = 'M') {
	$_period = ['M' => 1, 'T' => 3, 'S' => 6, 'A' => 12];
	$total = $_period[$periodo] * $step;
	return date('Y-m-d', strtotime("+$total months", strtotime($initial)));
}

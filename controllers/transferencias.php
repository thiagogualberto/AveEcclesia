<?php
use Sistema\Models\{Receita, Despesa, Transferencia};

const serialize = [
	'delegate' => ['conta_origem_nome', 'conta_destino_nome']
];

// GET /api/transferencias
function transferencias_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'dt_transferencia'),
			'conditions' => ['paroquia_id = ? AND dt_transferencia BETWEEN ? AND ?', $req->user->paroquia_id, $req->query->start_date, $req->query->end_date]
		];

		$result = Transferencia::filter($req, $options, serialize);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/transferencias/:id
function transferencias_get($req, $res)
{
	try {
		
		$transferencia = Transferencia::find($req->params->id);
		$res->json($transferencia->to_array(serialize));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/transferencias/:id
function transferencias_put($req, $res)
{
	$data = $req->body;
	$tmp = [
		'quitado' => $data->quitado
	];
	
	$trans = Transferencia::find($req->params->id);
	$result = $trans->receita->update_attributes($tmp);
	$result = $trans->despesa->update_attributes($tmp);
	$result = $trans->update_attributes($req->body);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Transferência atualizada com sucesso', 'data' => $trans->to_array(serialize)]);
	} else {
		$res->json(['success' => false, 'message' => 'Transferência com id='.$req->params->id.' não encontrado!']);
	}
}

// POST /api/transferencias
function transferencias_post($req, $res)
{
	try {

		$data = $req->body;
		$paroquia_id = $req->user->paroquia_id;
		$tmp = [
			'paroquia_id' => $req->user->paroquia_id,
			'descricao' => $data->descricao,
			'valor' => $data->valor,
			'pago' => $data->valor,
			'dt_pagamento' => $data->dt_transferencia,
			'dt_vencimento' => $data->dt_transferencia,
			'quitado' => $data->quitado ?? false
		];
		
		// Saca o valor da conta de origem
		$despesa = Despesa::create(array_merge($tmp, [
			'conta_id' => $data->conta_origem,
		]));

		// Deposita o valor na conta de destino
		$receita = Receita::create(array_merge($tmp, [
			'conta_id' => $data->conta_destino,
		]));

		// Informa os ids
		$data->despesa_id = $despesa->id;
		$data->receita_id = $receita->id;

		// Registra a transferência
		$transferencia = new Transferencia($data);
		$result = $transferencia->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!', 'data' => $transferencia->to_array(serialize)]);
		} else {
			$res->json(['success' => false, 'message' => 'Erro ao inserir registro! Tente novamente mais tarde.']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/transferencias/:id
function transferencia_delete($req, $res)
{
	$trans = Transferencia::find($req->params->id);
	$result = $trans->receita->delete();
	$result = $trans->despesa->delete();
	$result = $trans>delete();

	if ($result) {
		$res->json(['success' => true, 'message' => 'Transferência excluída com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Transferência com id='.$req->params->id.' não encontrado!']);
	}
}

// DELETE /api/transferencias?ids=1,2,3
function transferencias_delete($req, $res)
{
	$ids = explode(',', $req->query->ids);

	foreach ($ids as $id) {
		
		$trans = Transferencia::find($id);
		$result = $trans->receita->delete();
		$result = $trans->despesa->delete();
		$result = $trans->delete();

		if (!$result) {
			$res->json(['success' => false, 'message' => 'Transferência com id='.$req->params->id.' não encontrado!']);
		}
	}

	$res->json(['success' => true, 'message' => 'Transferências excluídas com sucesso', 'data' => ['id' => $ids]]);
}

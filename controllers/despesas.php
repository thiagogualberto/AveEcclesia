<?php
use WGenial\NumeroPorExtenso\NumeroPorExtenso;
use Sistema\Models\Despesa;
use HtmlPDF\HtmlPDF;
use Sistema\Date;

const serialize = [
	'delegate' => ['pessoa_nome', 'categoria_descricao', 'conta_nome'],
	'include' => ['conta']
];

// GET /api/despesas
function despesas_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'dt_pagamento'),
			'conditions' => [
				'dt_pagamento BETWEEN ? AND ? and paroquia_id = ?',
				$req->query->start_date,
				$req->query->end_date,
				$req->user->paroquia_id
			]
		];

		$result = Despesa::filter($req, $options, serialize);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/despesas/:id
function despesas_get($req, $res)
{
	try {
		
		$receita = Despesa::find($req->params->id);
		$res->json($receita->to_array(serialize));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/despesas/:id
function despesas_put($req, $res)
{
	// Define as variáveis
	$data = $req->body;
	if (exists($data, 'valor') and isset($data->pago)) $data->valor = $data->pago;

	$receita = Despesa::find($req->params->id);
	$result = $receita->update_attributes($data);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Despesa atualizada com sucesso', 'data' => $receita->to_array(serialize)]);
	} else {
		$res->json(['success' => false, 'message' => 'Despesa com id='.$req->params->id.' não encontrado!']);
	}
}

// POST /api/despesas
function despesas_post($req, $res)
{
	try {

		// Define as variáveis
		$data = $req->body;
		$data->conta_id = $data->conta_id ?? $req->user->paroquia->conta_id;
		if (exists($data, 'valor')) $data->valor = $data->pago;

		$receita = new Despesa($data);
		$result = $receita->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!', 'data' => $receita->to_array(serialize)]);
		} else {
			$res->json(['success' => false, 'message' => 'Erro ao inserir registro! Tente novamente mais tarde.']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/despesas/:id
function despesa_delete($req, $res)
{
	$receita = Despesa::find($req->params->id);
	$result = $receita->delete();

	if ($result) {
		$res->json(['success' => true, 'message' => 'Despesa excluída com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Despesa com id='.$req->params->id.' não encontrado!']);
	}
}

// DELETE /api/despesas?ids=1,2,3
function despesas_delete($req, $res)
{
	$ids = explode(',', $req->query->ids);
	$result = Despesa::table()->delete(['id' => $ids]);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Despesas excluídas com sucesso', 'data' => ['id' => $ids]]);
	} else {
		$res->json(['success' => false, 'message' => 'Despesa com id='.$req->params->id.' não encontrado!']);
	}
}


// GET /api/despesas/:id/recibo
function despesas_recibo($req, $res)
{
	try {
		
		$paroquia = $req->user->paroquia;

		// Instancia os objetos
		$rec = Despesa::find($req->params->id);
		$pdf = new HtmlPDF('src/template/recibo/despesa.html');
		$ext = new NumeroPorExtenso;

		// Define os dados
		$pdf->set('num', $rec->dt_pagamento->format('dYm'));
		$pdf->set('paroquia_nome', $paroquia->nome);
		$pdf->set('pessoa_nome', $rec->pessoa->nome);
		$pdf->set('valor', number_format($rec->valor, 2, ',', '.'));
		$pdf->set('extenso', $ext->converter($rec->valor));
		$pdf->set('descricao', $rec->descricao);
		$pdf->set('cidade', $paroquia->cidade);
		$pdf->set('date', Date::toFullString());

		// Exibe o pdf
		$pdf->output();		

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

function exists(&$obj, $key) {
	if (!isset($obj->$key) and empty($obj->$key)) {
		return true;
	}
	return false;
}

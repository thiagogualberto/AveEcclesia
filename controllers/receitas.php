<?php
use WGenial\NumeroPorExtenso\NumeroPorExtenso;
use Sistema\Models\Receita;
use HtmlPDF\HtmlPDF;
use Sistema\Date;

const serialize = [
	'delegate' => ['pessoa_nome', 'categoria_descricao', 'conta_nome'],
	'include' => ['conta']
];

// GET /api/receitas
function receitas_list($req, $res)
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

		$result = Receita::filter($req, $options, serialize);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/receitas/:id
function receitas_get($req, $res)
{
	try {
		
		$receita = Receita::find($req->params->id);
		$res->json($receita->to_array(serialize));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/receitas/:id
function receitas_put($req, $res)
{
	// Define as variáveis
	$data = $req->body;
	if (exists($data, 'valor') and isset($data->pago)) $data->valor = $data->pago;

	$receita = Receita::find($req->params->id);
	$result = $receita->update_attributes($data);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Receita atualizada com sucesso', 'data' => $receita->to_array(serialize)]);
	} else {
		$res->json(['success' => false, 'message' => 'Receita com id='.$req->params->id.' não encontrado!']);
	}
}

// POST /api/receitas
function receitas_post($req, $res)
{
	try {

		// Define as variáveis
		$data = $req->body;
		$data->conta_id = $data->conta_id ?? $req->user->paroquia->conta_id;
		if (exists($data, 'valor')) $data->valor = $data->pago;

		$receita = new Receita($data);
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

// DELETE /api/receitas/:id
function receita_delete($req, $res)
{
	$receita = Receita::find($req->params->id);
	$result = $receita->delete();

	if ($result) {
		$res->json(['success' => true, 'message' => 'Receita excluída com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Receita com id='.$req->params->id.' não encontrado!']);
	}
}

// DELETE /api/receitas?ids=1,2,3
function receitas_delete($req, $res)
{
	$ids = explode(',', $req->query->ids);
	$result = Receita::table()->delete(['id' => $ids]);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Receitas excluídas com sucesso', 'data' => ['id' => $ids]]);
	} else {
		$res->json(['success' => false, 'message' => 'Receita com id='.$req->params->id.' não encontrado!']);
	}
}

// GET /api/receitas/:id/recibo
function receitas_recibo($req, $res)
{
	try {
		
		$paroquia = $req->user->paroquia;

		// Instancia os objetos
		$rec = Receita::find($req->params->id);
		$pdf = new HtmlPDF('src/template/recibo/receita.html');
		$ext = new NumeroPorExtenso;

		// Define os dados
		$pdf->set('num', $rec->dt_pagamento->format('dYm'));
		$pdf->set('paroquia_nome', $paroquia->nome);
		$pdf->set('pessoa_nome', $rec->pessoa->nome);
		$pdf->set('valor', number_format($rec->pago, 2, ',', '.'));
		$pdf->set('extenso', $ext->converter($rec->pago));
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

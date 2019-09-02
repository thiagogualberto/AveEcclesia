<?php
use HtmlPDF\HtmlPDF;
use Sistema\Models\{Dizimista, Dizimo, Comunidade, Paroquia};

const serialize = [
	'delegate' => ['nome', 'dt_nascimento', 'cep', 'cidade', 'bairro', 'endereco', 'uf', 'tel', 'cel', 'email', 'comunidade_nome']
];

/**
 * Limpa as posições com valores vazios
 */
function array_clear(array $array)
{
	return array_filter($array, function ($item) {
		return !empty($item);
	});
}

function rel_dizimo($req, $res)
{
	switch ($req->query->tipo) {
		case 'lista':
			return rel_dizimista_list($req, $res);
		case 'nivers':
			return rel_dizimista_niver($req, $res);
		case 'niver_casamento':
			return rel_dizimista_niver_casamento($req, $res);
		case 'niver_conjuge':
			return rel_dizimista_niver_conjuge($req, $res);
		case 'recebidos':
			return rel_dizimos_recebidos($req, $res);
		case 'recebido_dizimista':
			return rel_dizimos_recebido_dizimista($req, $res);
		case 'recebido_comunidade':
			return rel_dizimos_recebido_comunidade($req, $res);
		default: break;
	}
}

function rel_dizimista_list($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$options = array_clear([
		'comunidade_id' => $req->query('comunidade'),
		'paroquia_id' => $req->user->paroquia_id,
		'ativo' => 1
	]);

	// Consulta os dizimistas da paroquia
	$dizimistas = Dizimista::all($options)->to_array(serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 33.5,
		'margin_bottom' => 27
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/dizimista_list.html', $pg_config);

	$pdf->set([
		'dizimistas' => $dizimistas,
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'paroquia_cnpj' => $paroquia->cnpj,
		'paroquia_tel' => $paroquia->tel1,
		'paroquia_endereco' => $paroquia->endereco,
		'paroquia_bairro' => $paroquia->bairro,
		'paroquia_cep' => $paroquia->cep,
		'paroquia_cidade' => $paroquia->cidade,
		'paroquia_uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

function rel_dizimista_niver($req, $res) {

	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$year = date('Y', strtotime($req->query->start_date));

	// Opções da busca
	$options = [
		'joins' => ['pessoa'],
		'conditions' => [
			"DATE_FORMAT(dt_nascimento, '$year-%m-%d') BETWEEN ? AND ? AND dizimistas.paroquia_id = ?",
			$req->query->start_date,
			$req->query->end_date,
			$req->user->paroquia_id
		]
	];

	// Consulta os dizimistas da paroquia
	$dizimistas = Dizimista::all($options)->to_array(serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 33.5,
		'margin_bottom' => 27
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/dizimista_niver.html', $pg_config);

	$pdf->set([
		'dizimistas' => $dizimistas,
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
		'paroquia_cnpj' => $paroquia->cnpj,
		'paroquia_tel' => $paroquia->tel1,
		'paroquia_endereco' => $paroquia->endereco,
		'paroquia_bairro' => $paroquia->bairro,
		'paroquia_cep' => $paroquia->cep,
		'paroquia_cidade' => $paroquia->cidade,
		'paroquia_uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

function rel_dizimista_niver_casamento($req, $res) {

	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$year = date('Y', strtotime($req->query->start_date));

	// Opções da busca
	$options = [
		'joins' => ['pessoa'],
		'conditions' => [
			"DATE_FORMAT(dt_casamento, '$year-%m-%d') BETWEEN ? AND ? AND dizimistas.paroquia_id = ?",
			$req->query->start_date,
			$req->query->end_date,
			$req->user->paroquia_id
		]
	];

	// Consulta os dizimistas da paroquia
	$dizimistas = Dizimista::all($options)->to_array(serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 33.5,
		'margin_bottom' => 27
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/dizimista_niver_casamento.html', $pg_config);

	$pdf->set([
		'dizimistas' => $dizimistas,
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
		'paroquia_cnpj' => $paroquia->cnpj,
		'paroquia_tel' => $paroquia->tel1,
		'paroquia_endereco' => $paroquia->endereco,
		'paroquia_bairro' => $paroquia->bairro,
		'paroquia_cep' => $paroquia->cep,
		'paroquia_cidade' => $paroquia->cidade,
		'paroquia_uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

function rel_dizimista_niver_conjuge($req, $res) {

	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$year = date('Y', strtotime($req->query->start_date));

	// Opções da busca
	$options = [
		'joins' => ['pessoa'],
		'conditions' => [
			"DATE_FORMAT(dt_conjuge, '$year-%m-%d') BETWEEN ? AND ? AND dizimistas.paroquia_id = ?",
			$req->query->start_date,
			$req->query->end_date,
			$req->user->paroquia_id
		]
	];

	// Consulta os dizimistas da paroquia
	$dizimistas = Dizimista::all($options)->to_array(serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 33.5,
		'margin_bottom' => 27
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/dizimista_niver_conjuge.html', $pg_config);

	$pdf->set([
		'dizimistas' => $dizimistas,
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
		'paroquia_cnpj' => $paroquia->cnpj,
		'paroquia_tel' => $paroquia->tel1,
		'paroquia_endereco' => $paroquia->endereco,
		'paroquia_bairro' => $paroquia->bairro,
		'paroquia_cep' => $paroquia->cep,
		'paroquia_cidade' => $paroquia->cidade,
		'paroquia_uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

function rel_dizimos_recebidos($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$options = [
		'joins' => ['pessoa'],
		'conditions' => [
			'pessoas.paroquia_id = ? AND plano_contas = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true',
			$paroquia->id,
			$paroquia->dizimo_id,
			$req->query->start_date,
			$req->query->end_date
		]
	];
	$serialize = [
		'delegate' => ['pessoa_nome']
	];

	$dizimos = Dizimo::all($options)->to_array($serialize);
	$total = array_reduce_sum($dizimos, 'pago');
	$dizimos = map_format($dizimos, ['valor' => 'money', 'pago' => 'money']);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 46,
		'margin_bottom' => 36
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/dizimos.html', $pg_config);

	$pdf->set([
		'dizimos' => $dizimos,
		'total' => money($total),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'paroquia_cnpj' => $paroquia->cnpj,
		'paroquia_tel' => $paroquia->tel1,
		'paroquia_endereco' => $paroquia->endereco,
		'paroquia_bairro' => $paroquia->bairro,
		'paroquia_cep' => $paroquia->cep,
		'paroquia_cidade' => $paroquia->cidade,
		'paroquia_uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

function rel_dizimos_recebido_comunidade($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$dizimo_id = $paroquia->dizimo_id;
	$start_date = $req->query->start_date;
	$end_date = $req->query->end_date;

	// Busca a comunidade
	$comunidade = Comunidade::find($req->query->comunidade);

	// Busca os dízimos da comunidade
	$dizimos = $comunidade->dizimos($dizimo_id, $start_date, $end_date)->to_array();

	// Calcula o total
	$total = array_reduce_sum($dizimos, 'pago');
	$dizimos = map_format($dizimos, ['valor' => 'money', 'pago' => 'money']);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 36
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/dizimos_comunidade.html', $pg_config);

	$pdf->set([
		'comunidade' => $comunidade->nome,
		'dizimos' => $dizimos,
		'total' => money($total),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'paroquia_cnpj' => $paroquia->cnpj,
		'paroquia_tel' => $paroquia->tel1,
		'paroquia_endereco' => $paroquia->endereco,
		'paroquia_bairro' => $paroquia->bairro,
		'paroquia_cep' => $paroquia->cep,
		'paroquia_cidade' => $paroquia->cidade,
		'paroquia_uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

function rel_dizimos_recebido_dizimista($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$dizimo_id = $paroquia->dizimo_id;
	$start_date = $req->query->start_date;
	$end_date = $req->query->end_date;

	// Busca o dizimista e os dízimos dele
	$dizimista = Dizimista::find($req->query->dizimista);
	$dizimos = $dizimista->dizimos($dizimo_id, $start_date, $end_date)->to_array();

	// Calcula o total
	$total = array_reduce_sum($dizimos, 'pago');
	$dizimos = map_format($dizimos, ['valor' => 'money', 'pago' => 'money']);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 36
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/dizimos_dizimista.html', $pg_config);

	$pdf->set([
		'dizimista' => $dizimista->pessoa->nome,
		'dizimos' => $dizimos,
		'total' => money($total),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'paroquia_cnpj' => $paroquia->cnpj,
		'paroquia_tel' => $paroquia->tel1,
		'paroquia_endereco' => $paroquia->endereco,
		'paroquia_bairro' => $paroquia->bairro,
		'paroquia_cep' => $paroquia->cep,
		'paroquia_cidade' => $paroquia->cidade,
		'paroquia_uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

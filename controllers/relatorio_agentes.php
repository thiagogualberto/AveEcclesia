<?php
use HtmlPDF\HtmlPDF;
use Sistema\Models\{Agente, Paroquia};

function rel_agentes($req, $res)
{
	switch ($req->query->tipo) {
		case 'lista':
			return rel_agentes_list($req, $res);
		case 'prestadores':
			return rel_prestadores($req, $res);
		case 'nivers':
			return rel_agentes_nivers($req, $res);
		default: break;
	}
}

function rel_agentes_list($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$serialize = [
		'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'email', 'sexo', 'estado_civil', 'comunidade_nome', 'funcao_nome']
	];

	// Consulta os agentes da paroquia
	$agentes = Agente::all(['paroquia_id' => $req->user->paroquia_id])->to_array($serialize);

	// echo '<pre>';
	// print_r($agentes);
	// die;

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 31,
		'margin_bottom' => 37
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/agentes.html', $pg_config);

	$pdf->set([
		'agentes' => $agentes,
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'cnpj' => $paroquia->cnpj,
		'tel1' => $paroquia->tel1,
		'tel2' => $paroquia->tel2,
		'endereco' => $paroquia->endereco,
		'bairro' => $paroquia->bairro,
		'cep' => $paroquia->cep,
		'cidade' => $paroquia->cidade,
		'uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
	
}

function rel_agentes_nivers($req, $res) {

	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$year = date('Y', strtotime($req->query->start_date));

	// Serialização do agente
	$serialize = [
		'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'email', 'sexo', 'estado_civil', 'comunidade_nome', 'funcao_nome']
	];

	// Opções da busca
	$options = [
		'joins' => ['pessoa'],
		'conditions' => [
			"DATE_FORMAT(dt_nascimento, '$year-%m-%d') BETWEEN ? AND ? AND agentes.paroquia_id = ?",
			$req->query->start_date,
			$req->query->end_date,
			$req->user->paroquia_id
		]
	];

	// Consulta os agentes da paroquia
	$agentes = Agente::all($options)->to_array($serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 33.5,
		'margin_bottom' => 27
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/agentes_nivers.html', $pg_config);

	$pdf->set([
		'agentes' => $agentes,
		'paroquia_nome' => $paroquia->nome,
		'logo' => Paroquia::get_logo($paroquia),
		'cnpj' => $paroquia->cnpj,
		'tel1' => $paroquia->tel1,
		'tel2' => $paroquia->tel2,
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
		'endereco' => $paroquia->endereco,
		'bairro' => $paroquia->bairro,
		'cep' => $paroquia->cep,
		'cidade' => $paroquia->cidade,
		'uf' => $paroquia->uf,
		'usuario' => $req->user->nome
	]);

	$pdf->output();
}

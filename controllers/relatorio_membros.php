<?php
use HtmlPDF\HtmlPDF;
use Sistema\Models\{Membro, PrestadorServico, Paroquia};

function rel_membros($req, $res)
{
	switch ($req->query->tipo) {
		case 'membros':
			return rel_membros_list($req, $res);
		case 'prestadores':
			return rel_prestadores($req, $res);
		case 'nivers':
			return rel_nivers($req, $res);
		default: break;
	}
}

function rel_membros_list($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$serialize = [
		'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil']
	];

	// Consulta os membros da paroquia
	$membros = Membro::all(['paroquia_id' => $req->user->paroquia_id])->to_array($serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 33.5,
		'margin_bottom' => 27
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/membros.html', $pg_config);

	$pdf->set([
		'membros' => $membros,
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

function rel_nivers($req, $res) {

	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$year = date('Y', strtotime($req->query->start_date));

	// Serialização do membro
	$serialize = [
		'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil']
	];

	// Opções da busca
	$options = [
		'joins' => ['pessoa'],
		'conditions' => [
			"DATE_FORMAT(dt_nascimento, '$year-%m-%d') BETWEEN ? AND ? AND membros.paroquia_id = ?",
			$req->query->start_date,
			$req->query->end_date,
			$req->user->paroquia_id
		]
	];

	// Consulta os membros da paroquia
	$membros = Membro::all($options)->to_array($serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 33.5,
		'margin_bottom' => 27
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/membros_nivers.html', $pg_config);

	$pdf->set([
		'membros' => $membros,
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

function rel_prestadores($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$serialize = [
		'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil']
	];

	// Consulta os prestadores da paroquia
	$prestadores = PrestadorServico::all(['paroquia_id' => $req->user->paroquia_id])->to_array($serialize);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 38.5,
		'margin_bottom' => 32
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/prestadores.html', $pg_config);

	$pdf->set([
		'prestadores' => $prestadores,
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

<?php
use HtmlPDF\HtmlPDF;
use Sistema\Models\{Receita, Despesa, Conta, PlanoContas, Paroquia};

function rel_financeiro_analitico($req, $res)
{
	$paroquia = $req->user->paroquia;

	// Consulta as receitas por categoria
	$receitas = PlanoContas::find_by_sql(
		'SELECT codigo, pl.descricao, SUM(pago) total FROM plano_contas pl
		INNER JOIN receitas rec ON pl.id = rec.plano_contas
		WHERE grupo = ? AND paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true
		GROUP BY codigo',
		['R', $req->user->paroquia_id, $req->query->start_date, $req->query->end_date]
	)->to_array();

	// Consulta as despesas por categoria
	$despesas = PlanoContas::find_by_sql(
		'SELECT codigo, pl.descricao, SUM(pago) total FROM plano_contas pl
		INNER JOIN despesas rec ON pl.id = rec.plano_contas
		WHERE grupo = ? AND paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true
		GROUP BY codigo',
		['D', $req->user->paroquia_id, $req->query->start_date, $req->query->end_date]
	)->to_array();

	// Calcula os totais
	$total_receitas = array_reduce_sum($receitas, 'total');
	$total_despesas = array_reduce_sum($despesas, 'total');

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 18
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/analitico.html', $pg_config);

	$pdf->set([
		'receitas' => percent($receitas, $total_receitas),
		'despesas' => percent($despesas, $total_despesas),
		'total_receitas' => money($total_receitas),
		'total_despesas' => money($total_despesas),
		'saldo_total' => money($total_receitas - $total_despesas),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
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

function rel_financeiro_despesa_pendente($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;

	// Pega a conta do caixa paroquial
	$caixa = Conta::first(['paroquia_id' => $req->user->paroquia_id, 'tipo' => 'CE']);

	// Consulta as despesas por categoria
	$despesas = Despesa::find_by_sql(
		'SELECT dt_vencimento, nome, descricao, valor, dt_pagamento, pago FROM despesas rec
		LEFT JOIN pessoas pes ON rec.pessoa_id = pes.id
		WHERE rec.paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = false
		ORDER BY dt_pagamento asc',
		[$req->user->paroquia_id, $req->query->start_date, $req->query->end_date]
	)->to_array();

	// Soma as despesas
	$total = array_reduce_sum($despesas, 'valor');

	// Formata os campos
	$formats = ['valor' => 'money', 'pago' => 'money'];
	$despesas = map_format($despesas, $formats);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 18
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/despesa_pendente.html', $pg_config);

	$pdf->set([
		'despesas' => $despesas,
		'total' => money($total),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
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

function rel_financeiro_receita_pendente($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;

	// Consulta as receitas por categoria
	$receitas = Receita::find_by_sql(
		'SELECT dt_vencimento, nome, descricao, valor, dt_pagamento, pago FROM receitas rec
		LEFT JOIN pessoas pes ON rec.pessoa_id = pes.id
		WHERE rec.paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = false
		ORDER BY dt_pagamento asc',
		[$req->user->paroquia_id, $req->query->start_date, $req->query->end_date]
	)->to_array();

	// Soma as receitas
	$total = array_reduce_sum($receitas, 'valor');

	// Formata os campos
	$formats = ['valor' => 'money', 'pago' => 'money'];
	$receitas = map_format($receitas, $formats);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 18
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/receita_pendente.html', $pg_config);

	$pdf->set([
		'receitas' => $receitas,
		'total' => money($total),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
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

function rel_financeiro_geral($req, $res)
{
	try {

		\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
		$paroquia = $req->user->paroquia;
	
		// Calcula o saldo anterior
		$total_anterior = Receita::find_by_sql(
			"SELECT ( SELECT SUM(pago) FROM `receitas` WHERE paroquia_id = ? AND quitado = 1 AND dt_pagamento < ? AND importado = false ) - ( SELECT SUM(pago) FROM `despesas` WHERE paroquia_id = ? AND quitado = 1 AND dt_pagamento < ? ) total",
			[ $req->user->paroquia_id, $req->query->start_date, $req->user->paroquia_id, $req->query->start_date ]
		)->to_array()[0]['total'];
	
		// Consulta as receitas
		$receitas = Receita::find_by_sql(
			'SELECT rec.*, pes.nome pessoa_nome FROM receitas rec INNER JOIN pessoas pes ON pes.id = rec.pessoa_id WHERE pes.paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true ORDER BY dt_pagamento asc',
			[ $req->user->paroquia_id, $req->query->start_date, $req->query->end_date ])->to_array();
		
		// Consulta as despesas
		$despesas = Despesa::find_by_sql(
			'SELECT dep.*, pes.nome pessoa_nome FROM despesas dep INNER JOIN pessoas pes ON pes.id = dep.pessoa_id WHERE pes.paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true ORDER BY dt_pagamento asc',
			[ $req->user->paroquia_id, $req->query->start_date, $req->query->end_date ])->to_array();
	
		// Calcula os totais
		$total_receitas = array_reduce_sum($receitas, 'pago');
		$total_despesas = array_reduce_sum($despesas, 'pago');
		$total_periodo  = $total_receitas - $total_despesas;
	
		// Formata os campos
		$formats = ['valor' => 'money', 'pago' => 'money'];
		$receitas = map_format($receitas, $formats);
		$despesas = map_format($despesas, $formats);
	
		$pg_config = [
			'margin_left' => 10,
			'margin_right' => 10,
			'margin_top' => 34,
			'margin_bottom' => 18
		];
	
		// Gera um novo PDF
		$pdf = new HtmlPDF('src/template/relatorio/geral.html', $pg_config);
	
		$pdf->set([
			'receitas' => $receitas,
			'despesas' => $despesas,
			'total_receitas' => money($total_receitas),
			'total_despesas' => money($total_despesas),
			'saldo_anterior' => money($total_anterior),
			'saldo_periodo' => money($total_periodo),
			'saldo_atual' => money($total_anterior + $total_periodo),
			'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
			'fim' => date('d/m/Y', strtotime($req->query->end_date)),
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

	} catch (Exception $e) {
		echo $e->getMessage();
	}
}

function rel_financeiro_demonstrativo($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$serialize = ['delegate' => ['categoria_codigo', 'categoria_descricao']];
	$conditions = [
		'pessoas.paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true',
		$req->user->paroquia_id, $req->query->start_date, $req->query->end_date
	];

	// Pega a conta do caixa paroquial
	$caixa = Conta::first(['paroquia_id' => $req->user->paroquia_id, 'tipo' => 'CE']);

	// Calcula o saldo anterior
	$total_anterior = Receita::find_by_sql(
		"SELECT ( SELECT SUM(pago) FROM `receitas` WHERE paroquia_id = ? AND quitado = 1 AND dt_pagamento < ? AND importado = false ) - ( SELECT SUM(pago) FROM `despesas` WHERE paroquia_id = ? AND quitado = 1 AND dt_pagamento < ? ) total",
		[ $req->user->paroquia_id, $req->query->start_date, $req->user->paroquia_id, $req->query->start_date ]
	)->to_array()[0]['total'];

	// Consulta as receitas por categoria
	$receitas = Receita::all([
		'select' => 'receitas.*, pessoas.nome',
		'conditions' => $conditions,
		'order' => 'dt_pagamento asc',
		'joins' => ['pessoa']
	])->to_array($serialize);

	// Consulta as despesas por categoria
	$despesas = Despesa::all([
		'select' => 'despesas.*, pessoas.nome',
		'conditions' => $conditions,
		'order' => 'dt_pagamento asc',
		'joins' => ['pessoa']
	])->to_array($serialize);

	// Calcula os totais
	$total_receitas = array_reduce_sum($receitas, 'pago');
	$total_despesas = array_reduce_sum($despesas, 'pago');

	// Formata os campos
	$formats = ['pago' => 'money'];
	$receitas = map_format($receitas, $formats);
	$despesas = map_format($despesas, $formats);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 18
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/demonstrativo.html', $pg_config);

	$pdf->set([
		'receitas' => $receitas,
		'despesas' => $despesas,
		'total_receitas' => money($total_receitas),
		'total_despesas' => money($total_despesas),
		'saldo_anterior' => money($total_anterior),
		'saldo_atual' => money($total_anterior + ($total_receitas - $total_despesas)),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
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

function rel_financeiro_pago($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;

	// Consulta as despesas por categoria
	$despesas = Despesa::find_by_sql(
		'SELECT dt_vencimento, nome, descricao, valor, dt_pagamento, pago FROM despesas rec
		INNER JOIN pessoas pes ON rec.pessoa_id = pes.id
		WHERE rec.paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true
		ORDER BY dt_pagamento asc',
		[$req->user->paroquia_id, $req->query->start_date, $req->query->end_date]
	)->to_array();

	// Calcula os totais
	$total = array_reduce_sum($despesas, 'pago');

	// Formata os campos
	$formats = ['valor' => 'money', 'pago' => 'money'];
	$despesas = map_format($despesas, $formats);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 18
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/pago.html', $pg_config);

	$pdf->set([
		'despesas' => $despesas,
		'total' => money($total),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
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

function rel_financeiro_recebido($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;

	// Consulta as receitas por categoria
	$receitas = Receita::find_by_sql(
		'SELECT dt_vencimento, nome, descricao, valor, dt_pagamento, pago FROM receitas rec
		INNER JOIN pessoas pes ON rec.pessoa_id = pes.id
		WHERE rec.paroquia_id = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true
		ORDER BY dt_pagamento asc',
		[$req->user->paroquia_id, $req->query->start_date, $req->query->end_date]
	)->to_array();

	// Calcula os totais
	$total = array_reduce_sum($receitas, 'pago');

	// Formata os campos
	$formats = ['valor' => 'money', 'pago' => 'money'];
	$receitas = map_format($receitas, $formats);

	$pg_config = [
		'margin_left' => 10,
		'margin_right' => 10,
		'margin_top' => 34,
		'margin_bottom' => 18
	];

	// Gera um novo PDF
	$pdf = new HtmlPDF('src/template/relatorio/recebido.html', $pg_config);

	$pdf->set([
		'receitas' => $receitas,
		'total' => money($total),
		'inicio' => date('d/m/Y', strtotime($req->query->start_date)),
		'fim' => date('d/m/Y', strtotime($req->query->end_date)),
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

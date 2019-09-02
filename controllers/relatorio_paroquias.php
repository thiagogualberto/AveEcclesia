<?php
use HtmlPDF\HtmlPDF;
use Sistema\Date;
use Sistema\Models\{Receita, Despesa, Paroquia, PlanoContas, Pessoa};

function rel_repasse($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;

	try {

		// Consulta o repasse de todas paroquias
		$repasse = Receita::find_by_sql(
			'SELECT rec.*, pes.nome FROM receitas rec
			INNER JOIN pessoas pes ON pes.id = rec.pessoa_id
			WHERE rec.paroquia_id = ? AND plano_contas = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true',
			[ 100000, $paroquia->dizimo_id, $req->query->start_date, $req->query->end_date ]
		)->to_array();

		$total = array_reduce_sum($repasse, 'pago');
		$repasse = map_format($repasse, ['valor' => 'money', 'pago' => 'money']);
	
		$pg_config = [
			'margin_left' => 10,
			'margin_right' => 10,
			'margin_top' => 33.5,
			'margin_bottom' => 18
		];
	
		// Gera um novo PDF
		$pdf = new HtmlPDF('src/template/relatorio/paroquia_repasse.html', $pg_config);
	
		$pdf->set([
			'repasse' => $repasse,
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

	} catch (Exception $e) {
		echo $e->getMessage();
	}
}

function rel_resumo($req, $res)
{
	\ActiveRecord\Serialization::$DATETIME_FORMAT = 'd/m/Y';
	$paroquia = $req->user->paroquia;
	$start_date = $req->query->start_date;
	$end_date = $req->query->end_date;

	function map_by_id ($obj) {
		$array = [];
		foreach ($obj as $value) {
			$array[$value->id] = $value->to_array();
		}
		return $array;
	}

	function map_by_categ($obj) {
		$array = [];
		foreach ($obj as $value) {
			$array[$obj->plano_contas][''] = $value->to_array();
		}
		return $array;
	}

	function map_by_column($arr, $col) {
		$array = [];
		foreach ($arr as $key => $value) {
			$array[$key] = $value[$col];
		}
		return $array;
	}

	function map_paroquias($paroquias = [], $receitas = [], $despesas = []) {

		$array = array_merge($receitas, $despesas);
		$nomes = [];
		$total = [];
		$total_receitas = [];
		$total_despesas = [];
		$result = [];
		
		foreach ($paroquias as $value)
		{
			extract($value);
			$nomes[$id] = $nome;
			$tmp = [];
			$result[$id] = paroquia($nome);

			foreach ($receitas as $key => $value)
			{
				if ($value['pessoa_id'] == $id)
				{
					$categ = $value['plano_contas'];
					$pago = $value['pago'];

					if (!isset($tmp[$categ])) {
						$tmp[$categ] = 0.0;
					}

					$result[$id]['total_receitas'] += $pago;
					$tmp[$categ] += $pago;
					unset($receitas[$key]);
				}
			}

			foreach ($despesas as $key => $value)
			{
				if ($value['pessoa_id'] == $id)
				{
					$categ = $value['plano_contas'];
					$pago = $value['pago'];

					if (!isset($tmp[$categ])) {
						$tmp[$categ] = 0.0;
					}

					$result[$id]['total_despesas'] += $pago;
					$tmp[$categ] += $pago;
					unset($despesas[$key]);
				}
			}

			$result[$id]['totais'] = $tmp;
		}

		return $result;
	}

	function paroquia($nome) {
		return [
			'nome' => $nome,
			'totais' => [],
			'total_receitas' => 0,
			'total_despesas' => 0
		];
	}

	function array_csv_title($file, $title, $paroquias = []) {
		$nomes = map_by_column($paroquias, 'nome');
		$header = merge(['Código', 'Descrição'], $nomes, ['Total por plano de contas']);
		fputcsv($file, [], ';');
		fputcsv($file, [$title], ';');
		fputcsv($file, $header, ';');
	}

	function array_csv_format($file, $array, $paroquias = []) {

		$paroquias = map_by_column($paroquias, 'totais');

		foreach ($array as $key => $value) {
			extract($value);
			$line = [$codigo, $descricao];
			$total = 0;
			foreach ($paroquias as $key => $value) {
				$valor = isset($value[$id]) ? $value[$id] : 0.00;
				$total += $valor;
				$line[] = brl($valor);
			}
			$line[] = brl($total);
			fputcsv($file, $line, ';');
		}
	}

	function array_csv_total($file, $paroquias = [], $label, $tag) {
		$total = map_by_column($paroquias, $tag);
		$total = array_map('brl', $total);
		$line = merge(['', $label], $total);
		fputcsv($file, [], ';');
		fputcsv($file, $line, ';');
	}

	function brl($value) {
		return 'R$ '.number_format($value, 2, ',', '.');
	}

	try {

		// Paróquias cadastradas
		$paroquias = Pessoa::all([
			'conditions' => "paroquia_id = 100000 AND nome LIKE 'Paróquia%'",
			'select' => 'id, nome'
		])->to_array();

		// Consulta as categorias
		$categ_receitas = PlanoContas::find_by_sql('SELECT id, codigo, descricao FROM plano_contas WHERE grupo = "R" AND analitica = 0');
		$categ_despesas = PlanoContas::find_by_sql('SELECT id, codigo, descricao FROM plano_contas WHERE grupo = "D" AND analitica = 0');

		// Mapeia pelo id
		$categ_receitas = map_by_id($categ_receitas);
		$categ_despesas = map_by_id($categ_despesas);

		$receitas = Receita::find_by_sql(
			'SELECT rec.*, pes.nome FROM receitas rec
			INNER JOIN pessoas pes ON pes.id = rec.pessoa_id
			WHERE rec.paroquia_id = ? AND nome LIKE \'Paróquia%\' AND dt_pagamento BETWEEN ? AND ? AND quitado = true',
			[ 100000, $req->query->start_date, $req->query->end_date ]
		)->to_array();

		$despesas = Despesa::find_by_sql(
			'SELECT dep.*, pes.nome FROM despesas dep
			INNER JOIN pessoas pes ON pes.id = dep.pessoa_id
			WHERE dep.paroquia_id = ? AND nome LIKE \'Paróquia%\' AND dt_pagamento BETWEEN ? AND ? AND quitado = true',
			[ 100000, $req->query->start_date, $req->query->end_date ]
		)->to_array();

		// Mapeia as paroquias
		$paroquias = map_paroquias($paroquias, $receitas, $despesas);
		
		$res->header('Content-Type', 'text/csv; charset=ISO-8859-1');
		$res->header('Content-Disposition', "attachment; filename=resumo_{$start_date}_{$end_date}.csv");
		
		// Abre o arquivo
		$file = fopen("php://output", "w");

		// Título das datas
		fputcsv($file, merge(['Início', Date::toString(new \DateTime($start_date))]), ';');
		fputcsv($file, merge(['Fim', Date::toString(new \DateTime($end_date))]), ';');

		// Relatório de receitas
		array_csv_title($file, 'Receitas', $paroquias);
		array_csv_format($file, $categ_receitas, $paroquias);
		array_csv_total($file, $paroquias, 'TOTAL DE RECEITAS POR PARÓQUIA', 'total_receitas');

		// Relatório de despesas
		array_csv_title($file, 'Despesas', $paroquias);
		array_csv_format($file, $categ_despesas, $paroquias);
		array_csv_total($file, $paroquias, 'TOTAL DE DESPESAS POR PARÓQUIA', 'total_despesas');

	} catch (Exception $e) {
		echo $e->getMessage();
	}
}

function merge(...$arrays) {
	$result = [];	
	foreach ($arrays as $array) {
		foreach ($array as $key => $value) {
			$result[] = iconv('UTF-8', 'ISO-8859-1', $value);
		}
	}
	return $result;
}
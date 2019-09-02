<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'controllers/relatorio_membros.php';
include 'controllers/relatorio_agentes.php';
include 'controllers/relatorio_dizimos.php';

use ExpressPHP\Express as app;
$router = app::Router();

$router->use('/financeiro', app::require('routes/api/relatorio_financeiro.php'));
$router->get('/membros', 'rel_membros');
$router->get('/agentes', 'rel_agentes');
$router->get('/dizimos', 'rel_dizimo');
$router->use('/paroquias', app::require('routes/api/relatorio_paroquias.php'));


/**
 * Funções de relatórios
 */
function map(array $array, $func) {
	return array_map($func, $array);
}

function money($value) {
	return 'R$ '.number_format($value, 2, ',', '.');
}

function percent($array, $total) {
	return map($array, function ($array) use ($total) {
		$array['percent'] = number_format((100 * $array['total']) / $total, 2, ',', '.');
		$array['total'] = money($array['total']);
		return $array;
	});
}

function map_format(array $array, array $formats = []) {
	return array_map(function ($item) use ($formats) {

		// Chama os formats definidos
		foreach ($formats as $key => $func) {
			$item[$key] = $func($item[$key]);
		}

		// Retorna o item formatado
		return $item;

	}, $array);
}

function array_reduce_sum(array $array, $field = false) {

	if ($field) {
		return array_reduce($array, function ($i, $arr) use ($field) {
			return $i += $arr[$field];
		});
	} else {
		return array_reduce($array, function ($i, $item) use ($field) {
			return $i += $item;
		});
	}
}

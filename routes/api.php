<?php
use ExpressPHP\Express as app;
$router = app::Router();

function array_remove(&$array, $index)
{
	$tmp = null;

	if (is_array($array))
	{
		$tmp = $array[$index];
		unset($array[$index]);
	}
	else if (is_object($array))
	{
		$tmp = $array->$index;
		unset($array->$index);
	}

	return $tmp;
}


// GET /api
$router->get('/', function ($req, $res) {
	$res->json([
		'version' => '2.0.0-alpha.1',
		'name' => 'Ave Ecclesia',
		'copyright' => 'Vertex Group 2018 - Todos direitos reservados'
	]);
});

// Suggestion routes
$router->use('/suggestion', app::require('routes/api/suggestion.php'));

// Definições padrão para todos os posts
$router->post('.*', function ($req, $res, $next) {
	$req->body->paroquia_id = $req->user->paroquia_id;
	$next();
});

// CRUD /api/pessoas
$router->use('/pessoas', app::require('routes/api/pessoas.php'));

// CRUD /api/membros
$router->use('/membros', app::require('routes/api/membros.php'));

// CRUD /api/dizimista
$router->use('/dizimista', app::require('routes/api/dizimista.php'));

// CRUD /api/dizimo
$router->use('/dizimo', app::require('routes/api/dizimo.php'));

// CRUD /api/batismo
$router->use('/batismo', app::require('routes/api/batismo.php'));

// CRUD /api/crisma
$router->use('/crisma', app::require('routes/api/crisma.php'));

// CRUD /api/matrimonio
$router->use('/matrimonio', app::require('routes/api/matrimonio.php'));

// CRUD /api/agentes
$router->use('/agentes', app::require('routes/api/agentes.php'));

// CRUD /api/funcoes
$router->use('/funcoes', app::require('routes/api/funcoes.php'));

// CRUD /api/comunidades
$router->use('/comunidade', app::require('routes/api/comunidade.php'));

// CRUD /api/prestadores
$router->use('/prestadores', app::require('routes/api/prestadores_servico.php'));

// CRUD /api/funcionarios
$router->use('/funcionarios', app::require('routes/api/funcionarios.php'));

// CRUD /api/receitas
$router->use('/receitas', app::require('routes/api/receitas.php'));

// CRUD /api/despesas
$router->use('/despesas', app::require('routes/api/despesas.php'));

// CRUD /api/transferencias
$router->use('/transferencias', app::require('routes/api/transferencias.php'));

// CRUD /api/contas
$router->use('/contas', app::require('routes/api/contas.php'));

// CRUD /api/plano-contas
$router->use('/plano-contas', app::require('routes/api/plano-contas.php'));

// Rotas de relatório
$router->use('/relatorio', app::require('routes/relatorio.php'));

// CRUD /api/users
$router->use('/users', app::require('routes/api/users.php'));

// CRUD /api/paroquia
$router->use('/paroquia', app::require('routes/api/paroquia.php'));

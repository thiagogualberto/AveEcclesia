<?php
include 'controllers/plano_contas.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'plano_contas_list');
$router->get('/receitas', 'plano_contas_receitas');
$router->get('/despesas', 'plano_contas_despesas');
$router->get('/:id', 'plano_contas_get');
$router->put('/:id', 'plano_contas_put');
$router->post('/', 'plano_contas_post');
$router->delete('/:id', 'receita_delete');
$router->delete('/', 'plano_contas_delete');

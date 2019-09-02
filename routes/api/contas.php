<?php
include 'controllers/contas.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'contas_list');
$router->get('/resumo', 'resumo_mensal');
$router->get('/:id', 'contas_get');
$router->put('/:id', 'contas_put');
$router->post('/', 'contas_post');
$router->delete('/:id', 'contas_delete');

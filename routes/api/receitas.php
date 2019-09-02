<?php
include 'controllers/receitas.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'receitas_list');
$router->get('/:id', 'receitas_get');
$router->put('/:id', 'receitas_put');
$router->post('/', 'receitas_post');
$router->delete('/:id', 'receita_delete');
$router->delete('/', 'receitas_delete');
$router->get('/:id/recibo', 'receitas_recibo');

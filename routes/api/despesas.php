<?php
include 'controllers/despesas.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'despesas_list');
$router->get('/:id', 'despesas_get');
$router->put('/:id', 'despesas_put');
$router->post('/', 'despesas_post');
$router->delete('/:id', 'despesa_delete');
$router->delete('/', 'despesas_delete');
$router->get('/:id/recibo', 'despesas_recibo');

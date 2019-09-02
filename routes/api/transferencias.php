<?php
include 'controllers/transferencias.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'transferencias_list');
$router->get('/:id', 'transferencias_get');
$router->put('/:id', 'transferencias_put');
$router->post('/', 'transferencias_post');
$router->delete('/:id', 'transferencia_delete');
$router->delete('/', 'transferencias_delete');

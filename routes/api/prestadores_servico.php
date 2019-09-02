<?php
include 'controllers/prestadores_servico.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'prestadores_list');
$router->get('/:id', 'prestadores_get');
$router->put('/:id', 'prestadores_put');
$router->post('/', 'prestadores_post');
$router->delete('/:id', 'prestadores_delete');
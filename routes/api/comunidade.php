<?php
include 'controllers/comunidade.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'comunidade_list');
$router->get('/:id', 'comunidade_get');
$router->put('/:id', 'comunidade_put');
$router->post('/', 'comunidade_post');
$router->delete('/:id', 'comunidade_delete');
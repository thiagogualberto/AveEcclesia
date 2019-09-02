<?php
include 'controllers/funcoes.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'funcoes_list');
$router->get('/:id', 'funcoes_get');
$router->put('/:id', 'funcoes_put');
$router->post('/', 'funcoes_post');
$router->delete('/:id', 'funcoes_delete');
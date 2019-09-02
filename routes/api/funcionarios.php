<?php
include 'controllers/funcionarios.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'funcionarios_list');
$router->get('/:id', 'funcionarios_get');
$router->put('/:id', 'funcionarios_put');
$router->post('/', 'funcionarios_post');
$router->delete('/:id', 'funcionarios_delete');
<?php
include 'controllers/agentes.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'agentes_list');
$router->get('/:id', 'agentes_get');
$router->put('/:id', 'agentes_put');
$router->post('/', 'agentes_post');
$router->delete('/:id', 'agentes_delete');

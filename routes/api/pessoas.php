<?php
include 'controllers/pessoas.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'pessoas_list');
$router->get('/:id', 'pessoas_get');
$router->put('/:id', 'pessoas_put');
$router->post('/', 'pessoas_post');
$router->delete('/:id', 'pessoas_delete');

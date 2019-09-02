<?php
include 'controllers/dizimo.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'dizimo_list');
$router->get('/:id', 'dizimo_get');
$router->put('/:id', 'dizimo_put');
$router->post('/', 'dizimo_post');
$router->delete('/:id', 'dizimo_delete');
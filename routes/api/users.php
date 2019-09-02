<?php
include 'controllers/users.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'users_list');
$router->get('/:id', 'users_get');
$router->put('/:id', 'users_put');
$router->post('/', 'users_post');
$router->delete('/:id', 'users_delete');

<?php
include 'controllers/paroquia.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'paroquia_list');
$router->get('/:id', 'paroquia_get');
$router->put('/:id', 'paroquia_put');
$router->post('/', 'paroquia_post');
$router->delete('/:id', 'paroquia_delete');

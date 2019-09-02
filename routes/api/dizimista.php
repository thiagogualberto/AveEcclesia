<?php
include 'controllers/dizimista.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'dizimista_list');
$router->get('/nivers', 'dizimista_nivers');
$router->get('/membros', 'membros_dizimista_list');
$router->get('/:id', 'dizimista_get');
$router->get('/:pessoa_id/dizimos', 'dizimista_dizimos');
$router->put('/:id', 'dizimista_put');
$router->post('/', 'dizimista_post');
$router->delete('/:id', 'dizimista_delete');
<?php
include 'controllers/membros.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'membros_list');
$router->get('/:id', 'membros_get');
$router->put('/:id', 'membros_put');
$router->post('/', 'membros_post');
$router->delete('/:id', 'membros_delete');

$router->get('/:id/dizimista', 'membro_dizimista');
$router->get('/:id/batismo', 'membro_batismo');
$router->get('/:id/crisma', 'membro_crisma');
$router->get('/:id/matrimonio', 'membro_matrimonio');
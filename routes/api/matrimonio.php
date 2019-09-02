<?php
include 'controllers/matrimonio.php';

$router = ExpressPHP\Express::Router();

$router->get('/notificacao', 'matrimonio_notificacao');

$router->get('/', 'matrimonio_list');
$router->get('/membros', 'membros_matrimonio_list');
$router->get('/:id', 'matrimonio_get');
$router->put('/:id', 'matrimonio_put');
$router->post('/', 'matrimonio_post');
$router->delete('/:id', 'matrimonio_delete');

$router->get('/:id/certidao', 'matrimonio_certidao');
$router->get('/:id/processo', 'matrimonio_processo');
$router->get('/:id/lembranca', 'matrimonio_lembranca');
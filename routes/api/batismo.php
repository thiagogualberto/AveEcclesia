<?php
include 'controllers/batismo.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'batismo_list');
$router->get('/membros', 'membros_batismo_list');
$router->get('/:id', 'batismo_get');
$router->put('/:id', 'batismo_put');
$router->post('/', 'batismo_post');
$router->delete('/:id', 'batismo_delete');

$router->get('/:id/certidao', 'batismo_certidao');
$router->get('/:id/lembranca', 'batismo_lembranca');
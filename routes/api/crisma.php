<?php
include 'controllers/crisma.php';

$router = ExpressPHP\Express::Router();

$router->get('/', 'crisma_list');
$router->get('/membros', 'membros_crisma_list');
$router->get('/:id', 'crisma_get');
$router->put('/:id', 'crisma_put');
$router->post('/', 'crisma_post');
$router->delete('/:id', 'crisma_delete');

$router->get('/:id/certidao', 'crisma_certidao');
$router->get('/:id/lembranca', 'crisma_lembranca');
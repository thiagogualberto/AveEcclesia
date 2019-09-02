<?php
include 'controllers/relatorio_paroquias.php';

$router = ExpressPHP\Express::Router();

$router->get('/repasse', 'rel_repasse');
$router->get('/resumo', 'rel_resumo');

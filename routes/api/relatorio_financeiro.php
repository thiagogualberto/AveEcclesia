<?php
echo 'aqui';
include 'controllers/relatorio_financeiro.php';
echo 'aqui';
$router = ExpressPHP\Express::Router();

$router->get('/geral', 'rel_financeiro_geral');
$router->get('/despesa-pendente', 'rel_financeiro_despesa_pendente');
$router->get('/receita-pendente', 'rel_financeiro_receita_pendente');
$router->get('/demonstrativo', 'rel_financeiro_demonstrativo');
$router->get('/pago', 'rel_financeiro_pago');
$router->get('/recebido', 'rel_financeiro_recebido');
$router->get('/analitico', 'rel_financeiro_analitico');

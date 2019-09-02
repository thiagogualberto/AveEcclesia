<?php
include 'controllers/suggestion.php';

$router = ExpressPHP\Express::Router();

$router->get('/dizimista', 'dizimista_suggestion');
$router->get('/dizimo', 'dizimo_suggestion');
$router->get('/membros', 'membros_suggestion');
$router->get('/comunidade', 'comunidade_suggestion');
$router->get('/matrimonio', 'matrimonio_suggestion');
$router->get('/batismo', 'batismo_suggestion');
$router->get('/crisma', 'crisma_suggestion');
$router->get('/agentes', 'agente_suggestion');
$router->get('/prestadores', 'prestadores_suggestion');
$router->get('/paroquia', 'paroquia_suggestion');
$router->get('/usuario', 'usuario_suggestion');
$router->get('/funcionarios', 'funcionarios_suggestion');
$router->get('/contas', 'contas_suggestion');
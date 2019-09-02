<?php
include_once 'src/helpers/secure_page.php';

use ExpressPHP\Express as app;
$router = app::Router();

// Cadastro
$router->get('/cadastro/funcoes', app::render('src/pages/funcoes.php'));

// Rota React
$router->get('/.*', app::render('src/template/react.php'));

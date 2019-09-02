<?php
include 'controllers/auth.php';

$router = ExpressPHP\Express::Router();

$router->post('/login', 'auth_login');
$router->get('/logout', 'auth_logout');
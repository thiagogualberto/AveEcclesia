<?php
include 'vendor/autoload.php';
include 'src/helpers/secure_page.php';

// Versão atual do app
define('APP_VERSION', '2.0.0');

use ExpressPHP\Express as app;
use Sistema\Models\Usuario;

// Router para http://localhost/aveecclesia
$app = new app;

// Arquivos estáticos
$app->use(app::static('static'));
$app->use('/uploads', app::static('uploads'));

// Plugins
$app->use(new Sistema\HttpsRedirect);
$app->use(new Sistema\Debug);
$app->use(new Sistema\Dotenv);
$app->use(new Sistema\LocalAuth);
$app->use(new Sistema\IncludeLogged);
$app->use(new Sistema\Replaces);
$app->use(new Sistema\ORM);
$app->use(new Sistema\UserPermission);


// API do sistema
$app->use('/api', isLogged(), app::require('routes/api.php'));

// Autenticação do sistema
$app->use('/auth', app::require('routes/auth.php'));
$app->get('/login', redirectLogged(), app::render('src/pages/login.php'));

// Rotas do sistema
$app->use('/', isLogged(), app::require('routes/sistema.php'));

$app->get('/user', function ($req, $res) {
	$res->json($req->user);
});

$app->get('/user/:id', function ($req, $res) {

	$usuario = Usuario::find($req->params->id);

	if ($usuario) {
		$res->json($usuario->to_array([
			'except' => 'senha',
			'include' => 'paroquia'
		]));
	} else {
		$res->json(['success'=>false, 'message'=>'Usuario com id='.$req->params->id.' não encontrado!']);
	}
});

$app->post('/post-debug', function ($req, $res) {
	$res->json($req->body);
});

$app->put('/post-debug/:id', function ($req, $res) {

	$data = [
		'body' => $req->body,
		'params' => $req->params
	];

	$res->json($data);
});

$app->use(function ($req, $res) {
	$res->status(404);
	$res->send('<style>body{padding-top:20%}h1,p{font-family:Arial;text-align:center}</style>');
	$res->send('<h1>Not Found :(</h1>');
	$res->send('<p>The requested URL '.$req->url.' was not found on this server.</p>');
});

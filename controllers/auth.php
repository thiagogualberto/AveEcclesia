<?php
use Sistema\Models\{Usuario, Paroquia};

function auth_logout($req, $res)
{
	$req->auth->logout();		// Fecha a sessão
	$res->location('/login');	// Redireciona para página de login
	$res->end();
}

function auth_login($req, $res)
{
	// Path se logado
	$path = isset($req->query->redirect) ? $req->query->redirect : '/';

	try {

		// Busca o usuário
		$user = Usuario::find_by_usuario($req->body->user);

		// Se tiver algum resultado
		if ($user)
		{
			if (base64_decode($user->senha) == $req->body->pass) {
	
				$_SESSION['user'] = $user->to_array([
					'except' => 'senha',
					'include' => 'paroquia'
				]);
		
			} else {
				// Redireciona para /login
				$path = '/login?redirect=' . $path;
				// Mensagem de erro
				throw new Exception('Senha incorreta.', 1); 
			}

		} else {
			// Redireciona para /login
			$path = '/login?redirect=' . $path;
			// Mensagem de erro
			throw new Exception('Usuário não existe.', 1); 
		}

	} catch (Exception $e) {

		if ($e->getCode() === 0){
			$_SESSION['error'] = 'Erro de conexão com o banco de dados.';
		} else {
			$_SESSION['error'] = $e->getMessage();
		}

	} finally {
		$res->location($path);
		$res->end();
	}
}

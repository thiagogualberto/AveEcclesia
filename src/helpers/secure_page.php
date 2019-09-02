<?php
function isLogged()
{
	return function ($req, $res, $next)
	{
		if ($req->user != null) {
			$next();
		} else if ($req->type('application/json')) {
			$res->status(401);
			$res->json(['message' => 'Usuário não tem permissão de acesso!']);
		} else {
			$res->location("/login?redirect={$req->route->result_path}");
			$res->end();
		}
	};
}

function redirectLogged()
{
	return function ($req, $res, $next)
	{
		$path = isset($req->query->redirect) ? $req->query->redirect : '/';

		if ($req->user != null) {
			$res->location($path);
			$res->end();
		} else {
			$next();
		}
	};
}

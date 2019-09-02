<?php
namespace Sistema;

class UserPermission
{
	public function __invoke($req, $res, $next) {

		// Retorna se o usuário tem a permissão mínima
		$res->user_can = function ($permission, $min = 1) use ($req) {
			if (isset($req->user->$permission)) {
				return $req->user->$permission >= $min;
			} else {
				return true;
			}
		};

		// Segue em frente
		$next();
	}
}
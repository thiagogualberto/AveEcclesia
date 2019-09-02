<?php
namespace Sistema;

class HttpsRedirect
{
	public function __invoke($req, $res, $next)
	{
		$url = "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

		// Redireciona para url acima caso não seja https e não seja localhost
		if ((!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') && $_SERVER['HTTP_HOST'] !== 'localhost') {
			$res->header('Location', $url);
			$res->end();
		} else {
			$next();
		}
	}
}

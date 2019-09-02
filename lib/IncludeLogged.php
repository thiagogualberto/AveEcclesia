<?php
namespace Sistema;

class IncludeLogged
{
	public function __invoke($req, $res, $next) {

		$res->include_logged = function (string $path) use ($req, $res) {
			if ($req->user != null) {
				include $path;
			}
		};

		$next();
	}
}

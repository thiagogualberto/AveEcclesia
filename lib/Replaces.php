<?php
namespace Sistema;

class Replaces {

	function __invoke($req, $res, $next) {

		// Versão do app para evitar cachê
		$version = DEBUG ? time() : APP_VERSION;

		// Url com o path atual
		$res->url = function (string $url) use ($req) {
			echo $req->app->mounturl.$url;
		};

		// Script com o path atual
		$res->script = function (string $url) use ($req, $version) {
			echo "<script src='{$req->app->mounturl}$url?v=$version'></script>";
		};

		// Css com o path atual
		$res->css = function (string $url) use ($req, $version) {
			echo "<link rel='stylesheet' href='{$req->app->mounturl}$url?v=$version'>";
		};

		$next();
	}
}
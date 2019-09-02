<?php
namespace Sistema;

class Debug
{
	public function __invoke($req, $res, $next) {

		$res->debug = function ($item, $die = false) use ($req, $res) {

			// Só abre o debug se for com a query debug
			if (isset($_GET['debug']))
			{
				echo '<pre>';
				print_r($item);
				echo '</pre>';

				// Fecha a conexão
				if ($die) die;
			}
		};

		$next();
	}
}
<?php
namespace Sistema;

use Webmozart\PathUtil\Path;

class Dotenv
{
	public function __invoke($req, $res, $next) {

		// Busca o path nos sistemas linux e windows
		$path = Path::canonicalize(__DIR__.'/..');
		$dotenv = new \Dotenv\Dotenv($path);
		$dotenv->load();

		// Define se é debug ou não
		define('DEBUG', getenv('DEBUG') == 'true');

		// Mostra erros no modo debug
		if (DEBUG) {
			ini_set('display_errors', 1);
			error_reporting(E_ALL);
		}

		$next();
	}
}

<?php
namespace Sistema;

class ORM {

	function __invoke($req, $res, $next) {

		\ActiveRecord\Config::initialize(function($cfg) {

			$user = $_ENV['DB_USER'] ?? 'root';
			$pass = $_ENV['DB_PASS'] ?? '';
			$host = $_ENV['DB_HOST'] ?? 'localhost';
			$db = $_ENV['DB_NAME'] ?? 'aveecclesia';

			$cfg->set_model_directory('models/');
			$cfg->set_connections([
				'development' => "mysql://$user:$pass@$host/$db?charset=utf8"
			]);
		});

		\ActiveRecord\Serialization::$DATETIME_FORMAT = 'Y-m-d';

		$next();
	}
}
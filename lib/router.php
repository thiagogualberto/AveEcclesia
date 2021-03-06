<?php
/**
 * PHP Router based
 * 
 * author: Carlos Roberto
 * date: 18/12/2017
 */

namespace ExpressPHP;

class Router {

	// As rotas da aplicação
	private $routes = [
		'GET' => [],
		'PUT' => [],
		'POST' => [],
		'DELETE' => [],
	];

	private $path = '';   // Path da aplicação
	public $home = '/';   // Página home da aplicação
	public $uri = '/';    // Uri atual do navegador

	private $req; // Objeto do requisição
	private $res; // Objeto da resposta

	function __construct($home = '/')
	{
		// Home da aplicação
		$this->home = trim_uri($home);
		
		// Adiciona a uri
		preg_match("@$home([^?]*)@", $_SERVER['REQUEST_URI'], $matches);
		$this->uri = trim_uri($matches[1]);

		$this->req = new Router\Request($this->uri);
		$this->res = new Router\Response($home);
	}

	public function all($uri, ...$callback) {
		$this->request($uri, '*', $callback);
	}

	public function get($uri, ...$callback) {
		$this->request($uri, 'GET', $callback);
	}

	public function post($uri, ...$callback) {
		$this->request($uri, 'POST', $callback);
	}

	public function put($uri, ...$callback) {
		$this->request($uri, 'PUT', $callback);
	}

	public function delete($uri, ...$callback) {
		$this->request($uri, 'DELETE', $callback);
	}

	public function request($uri = '/', $method = '*', $callback)
	{
		$route = new Router\Route();

		$route->uri = rtrim($this->path . $uri, '/');
		$route->method = $method;
		$route->callback = $callback;

		if ($method !== '*') {
			$this->routes[$method][] = $route;
		} else {
			$this->routes['GET'][] = &$route;
			$this->routes['POST'][] = &$route;
			$this->routes['PUT'][] = &$route;
			$this->routes['DELETE'][] = &$route;
		}
	}

	public function use($path = '/', $file = '')
	{
		// Passa a instância de router e o path atual
		$router = $this;
		$this->path = rtrim($this->path . $path, '/');

		// Inclui o arquivo com sub-rotas
		include $file;

		// Remove o path atual e desaloca o router
		$this->path = str_replace($path, '', $this->path);
		unset($router);
	}

	public function files($path = '/', $type = 'text/plain')
	{
		$this->request($path.'/.*', 'GET', [0 => false, 'type' => $type]);
	}

	public function submit()
	{
		$method = $_SERVER['REQUEST_METHOD'];

		foreach ($this->routes[$method] as $value)
		{
			// Cria o regex da rota atual
			$regex = $this->route_regex($value->uri);

			if ($this->route_matches($regex))
			{
				// Extrai os parâmetros da url
				$this->req->params = $this->extract_params($this->uri, $value->uri, $regex);

				if (is_callable($value->callback[0]))
				{
					// Quando função
					$this->exec_callbacks($value->callback);
				}
				else if (is_string($value->callback[0]))
				{
					// Quando arquivo
					$this->include($value->callback[0]);
				}
				else {
					$this->res->type($value->callback['type']);
					echo file_get_contents(ltrim($this->uri, '/'));
				}

				return;
			}
		}

		$this->res->status(404);
		die;
	}

	public function getRoutes($method = '*')
	{
		if ($method === '*') {
			return $this->routes;
		} else {
			return $this->routes[$method];
		}
	}

	/**
	 * Define o path da aplicação removendo a '/' da direita
	 * (Path atual de início)
	 */
	private function setPath($path)
	{
		rtrim($this->path . $path, '/');
	}

	public function matches($uri) {
		$regex = $this->route_regex($uri);
		return $this->route_matches($regex);
	}

	/**
	 * Gera o regex para a rota atual
	 */
	private function route_regex($uri) {
		$uri = preg_replace('/(:\w+)/', '(\w+)', $uri);
		return "#^$uri/?$#" ;
	}

	/**
	 * Verifica se a rota bate com a uri atual
	 */
	private function route_matches($regex) {
		return preg_match($regex, $this->uri);
	}

	/**
	 * Extrai os parâmetros da rota
	 */
	private function extract_params($uri, $path, $regex)
	{
		preg_match_all('/:\w+/', $path, $matches);
		$params = array_map('ExpressPHP\trim_params', $matches[0]);

		preg_match($regex, $uri, $values);
		unset($values[0]);
		
		return (object) array_combine($params, $values);
	}

	/**
	 * Executa os callbacks passando o next como parâmetro
	 */
	private function exec_callbacks($callbacks)
	{
		$next = false; // Flag next que controla se deve executar o próximo callback

		foreach ($callbacks as $callback) {
			
			// Coloca false na flag next
			$next = false;

			// Verifica se é callback
			if (is_callable($callback))
			{
				// Executa o callback com a função next
				$callback($this->req, $this->res, function () use (&$next) {
					$next = true;
				});
			}
			else
			{
				// Inclui o arquivo
				$this->include($callback);
			}

			// Se a função next não for chamada, encerra
			if (!$next) return;
		}
	}

	public function include($file)
	{
		// Declara para ser acessível pelo arquivo
		$req = $this->req;
		$res = $this->res;
		$router = $this;

		include $file;
	}

	public function include_logged($file)
	{
		if ($this->req->user != null) {
			$this->include($file);
		}
	}
}

// Função para remover os ':' dos parâmetros
function trim_params ($value) {
	return ltrim($value, ':');
}

function trim_uri($uri) {
	return $uri !== '/' ? rtrim($uri, '/') : '/';
}

namespace ExpressPHP\Router;

class Route {
	public $uri;
	public $method;
	public $callback;
}

class Request {
	public $body;
	public $query;
	public $user;
	public $uri;

	function __construct($uri = '/') {

		$this->uri = $uri;
		$this->query = (object) $_GET;
		$this->user = isset($_SESSION['user']) ? (object) $_SESSION['user'] : null;

		if ($this->type('application/json')) {
			$this->body = json_decode(file_get_contents('php://input'));
		} else {
			$this->body = (object) $_POST;
		}
	}

	public function type($value) {
		return isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] === $value : false;
	}

	public function query ($key) {
		return isset($this->query->$key) ? $this->query->$key : null;
	}

	public function body ($key) {
		return isset($this->body->$key) ? $this->body->$key : null;
	}
}

class Response {

	private $home;

	public function __construct($home = '') {
		$this->home = $home;
	}

	public function send($resp) {
		echo $resp;
	}

	public function json($resp) {
		$this->type('application/json');

		if (DEBUG) {
			echo json_encode($resp, JSON_PRETTY_PRINT);
		} else {
			echo json_encode($resp);
		}
	}

	public function status($status) {
		http_response_code($status);
	}

	public function header($key, $value) {
		header("$key: $value");
	}

	public function location($loc) {
		$loc = $this->home . $loc;
		$this->header('Location', $loc);
	}

	public function type($type) {
		$this->header('Content-Type', "$type; charset=utf-8");
	}

	public function end() {
		exit;
	}
}
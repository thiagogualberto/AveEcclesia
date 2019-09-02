<?php
namespace Sistema;

class PropTypes
{
	public static function int() {
		return new TypeChecker('integer', function ($val) {
			return is_int($val);
		});
	}

	public static function date() {
		return new TypeChecker('date', function ($val) {
			return preg_match('/\d{4}-\d{2}-\d{2}/', $val);
		});
	}

	public static function string() {
		return new TypeChecker('string', function ($val) {
			return is_string($val);
		});
	}

	public static function boolean() {
		return new TypeChecker('boolean', function ($val) {
			return $val === 0 || $val === 1 || $val === true || $val === false || $val === 'true' || $val === 'false';
		});
	}
}

class TypeChecker {

	public $name = null; // O nome do campo
	public $value = null; // O valor de checagem
	public $callback = null; // Callback de checagem de tipo

	public function __construct($type, $callback) {
		$this->type = $type;
		$this->callback[] = $callback;
	}

	public function set($name = null, $value = null) {
		
		$this->name = $name;
		$this->value = $value;

		if (!$this->check() && $value !== null) {
			$this->exception("The field $name must be a $this->type");
		}
	}

	public function check() {
		foreach ($this->callback as $key => $callback) {
			$callback($this->value);
		}
	}

	// Tamanho mínimo
	public function min($val) {

		$this->callback[] = function ($value) {
			if (strlen($value) < $val) {
				$this->exception("The field $this->name can't be lowest than $val");
			}
		};

		return $this;
	}

	// Tamanho máximo
	public function max($val) {

		$this->callback[] = function ($value) {
			if (strlen($value) > $val) {
				$this->exception("The field $this->name can't be bigger than $val");
			}
		};

		return $this;
	}

	// Pode ser nulo
	public function notnull() {

		$this->callback[] = function ($value) {
			if ($value === null) {
				$this->exception("The field $this->name can't be null");
			}
		};

		return $this;
	}

	// É obrigatório
	public function required() {

		$this->callback[] = function ($value) {
			if ($value === null) {
				$this->exception("The field $this->name is required");
			}
		};

		return $this;
	}

	private function exception($msg) {
		throw new CheckException($msg, 1);
	}

	public function __call($method, $args)
    {
        if (isset($this->$method)) {
            $func = $this->$method;
            return call_user_func_array($func, $args);
        }
    }
}

class CheckException extends \Exception {}
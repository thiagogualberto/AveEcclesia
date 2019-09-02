<?php
namespace Sistema\Models;

class Model extends \ActiveRecord\Model
{
	public function __construct($attributes=[], $guard_attributes=true, $instantiating_via_find=false, $new_record=true)
	{
		$attrs = [];

		foreach ($attributes as $key => $value)
		{
			if (is_object($value)) {
				$attrs[$key] = (array) $value;
			} else {
				$attrs[$key] = $value;
			}
		}

		return parent::__construct($attrs, $guard_attributes, $instantiating_via_find, $new_record);
	}

	/**
	 * Finder method which will find by a single or array of primary keys for this model.
	 *
	 * @see find
	 * @param array $values An array containing values for the pk
	 * @param array $options An options array
	 * @return Model
	 * @throws {@link RecordNotFound} if a record could not be found
	 */
	public static function find_by_pk($values, $options)
	{
		if ($values===null) {
			throw new RecordNotFound("Couldn't find ".get_called_class()." without an ID");
		}

		$table = static::table();

		if ($table->cache_individual_model) {
			$list = static::get_models_from_cache($values, $options);
		} else {
			$options['conditions'] = static::pk_conditions($values);
			$list = $table->find($options);
		}

		$results = count($list);

		if (!is_array($values)) $values = array($values);
		if ($results != ($expected = count($values))) {

			$class = get_called_class();
			$values = join(',',$values);

			if ($expected == 1) {
				throw new \ActiveRecord\RecordNotFound("Couldn't find $class with ID=$values");
			}

			throw new \ActiveRecord\RecordNotFound("Couldn't find all $class with IDs ($values) (found $results, but was looking for $expected)");
		}

		return $expected == 1 ? $list[0] : $list;
	}

	/**
	 * Mass update the model with an array of attribute data and saves to the database.
	 *
	 * @param array $attributes An attribute data array in the form array(name => value, ...)
	 * @return boolean True if successfully updated and saved otherwise false
	 */
	public function update_attributes($attributes)
	{
		$attrs = [];

		foreach ($attributes as $key => $value)
		{
			if (is_object($value)) {
				$this->$key->update_attributes($value);
			} else {
				$attrs[$key] = $value;
			}
		}

		return parent::update_attributes($attrs);
	}

	public static function find()
	{
		$result = parent::find(...func_get_args());

		if (is_array($result)) {
			return new ResultCollection($result);
		}
		
		return $result;
	}

	public static function find_by_sql($sql, $values = NULL)
	{
		$result = parent::find_by_sql($sql, $values);

		if (is_array($result)) {
			return new ResultCollection($result);
		}
		
		return $result;
	}

	/**
	 * Save the nested class
	 */
	public function save($validate=true)
	{
		$result = true;

		$delegate = $this::$delegate;
		unset($delegate['processed']);

		foreach ($delegate as $key => $value) {
			if (!is_null($this->{$value['to']}) && $this->{$value['to']}->is_dirty()) {
				$result = $this->{$value['to']}->save();
			}
		}

		return parent::save() && $result;
	}

	/**
	 * Serialize delegate fields
	 */
	public function to_array(array $options = [])
	{
		$delegate = array_remove($options, 'delegate');
		$array = parent::to_array($options);

		// Se for para exibir esse campo
		if ($delegate) {
			
			$delegate = array_flip($delegate);
			$keys = get_delegate_keys($this);

			foreach ($keys as $key) {
	
				// Delegate keys
				if (count($key) == 2) {
					list($key1, $key2) = $key;
					$key = $key1.'_'.$key2;
				} else {
					$key = $key[0];
				}

				// Se a chave existir na lista de delegate
				if (array_key_exists($key, $delegate)) {

					// Seta o valor
					$value = $this->$key;
		
					// Se é datetime
					if ($value instanceof \ActiveRecord\DateTime) {
						$array[$key] = $value->format(\ActiveRecord\Serialization::$DATETIME_FORMAT);
					} else {
						$array[$key] = $value;
					}
				}
			}
		}

		return $array;
	}

	public function to_object($options = [])
	{
		$obj = new \stdClass();
		$array = $this->to_array($options);

		foreach ($array as $key => $value) {
			
			if (is_array($value)) {
				$value = (object) $value;
			}

			$obj->$key = $value;
		}

		return $obj;
	}

	/**
	 * Filtra os dados de acordo com a necessidade do AveEcclesia
	 */
	public static function filter($req, array $options = ['conditions' => ['']], array $serialize_options = [])
	{
		$all = [];
		$sort = array_remove($options, 'sort');
		$filter = array_remove($options, 'filter');
		$search = $req->query('search');

		function add (&$options, $condition, ...$value)
		{
			if (!isset($options['conditions'])) $options['conditions'][0] = '';
			$cond = $options['conditions'][0];
			$cond .= ' and ' . $condition;

			$options['conditions'] = array_merge($options['conditions'], $value);
			$options['conditions'][0] = ltrim($cond, ' and');
		}

		// Cria o conditions
		if (!isset($options['conditions'])) $options['conditions'][0] = '';

		// Adiciona o id da paroquia
		if (strpos($options['conditions'][0], 'paroquia_id') === false) {
			add($options, 'pessoas.paroquia_id = ?', $req->user->paroquia_id);
		}

		// Opções da query de busca
		if ($filter and !empty($search)) {
			add($options, "`$filter` LIKE ?", "%$search%");
		}

		// Se está ativo ou não
		if (isset($req->query->ativo)) {
			add($options, 'ativo = ?', $req->query->ativo);
		}

		// Alias dos atributos
		$alias = static::$alias_attribute;
		static::$alias_attribute = [];

		foreach ($alias as $key => $value) {
			if (isset($options['conditions'][$value])) {
				$options['conditions'][$key] = $options['conditions'][$value];
				unset($options['conditions'][$value]);
			}
		}

		// Sort da tabela
		if ($sort) $sort .= ' ' . $req->query('order', 'asc');

		try {

			// Se existir registros, ele busca no banco
			if ($count = self::count($options))
			{
				$options = array_merge($options, [
					'limit' => $req->query('limit', 10),
					'offset' => $req->query('offset', 0),
					'order' => $sort
				]);
	
				$result = self::find('all', $options);
				$all = $result->to_array($serialize_options);

				// Preenche o alias novamente
				static::$alias_attribute = $alias;
			}

		} catch (Exception $e) {
			echo $e->getMessage();
		}

		return [
			'success' => true,
			'total' => $count,
			'rows' => $all,
			// 'options' => $options
		];
	}
}

class ResultCollection implements \Iterator {

	// Resultados da query
	private $results = [];

	public function __construct($results = []) {
		$this->results = $results;
	}

	public function to_array($options = [])
	{
		$map = array_remove($options, 'map');
		$all = [];

		if ($map) {
			foreach ($this->results as $result) {
				$all[] = $map($result->to_array($options));
			}
		} else {
			foreach ($this->results as $result) {
				$all[] = $result->to_array($options);
			}
		}

		return $all;
	}

	public function rewind() {
        reset($this->results);
    }

	public function current() {
        return current($this->results);
	}
	
	public function key() {
		return key($this->results);
	}

	public function next() {
		return next($this->results);
	}

	public function valid() {
        $key = key($this->results);
        return ($key !== NULL && $key !== FALSE);
    }
}

function get_delegate_keys($result) {

	$keys = [];

	foreach ($result::$delegate as $value) {

		$delegate = $value['delegate'];
		$prefix = $value['prefix'];
		$count = count((array) $delegate);

		if ($prefix) {
			for ($i=0; $i<$count; $i++) $keys[] = [$prefix, $delegate[$i]];
		} else {
			for ($i=0; $i<$count; $i++) $keys[] = [$delegate[$i]];
		}
	}

	return $keys;
}

// Remove array position and return
function array_remove(array &$array, $index)
{
	if (isset($array[$index]))
	{
		$tmp = $array[$index];
		unset($array[$index]);
		return $tmp;
	}
	else
	{
		return null;
	}
}
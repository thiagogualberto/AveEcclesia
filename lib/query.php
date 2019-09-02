<?php

/**
 * Faz select no banco de dados com as informações passadas
 */
function select ($table, $cols = '*', $where = '')
{
	global $conn;

	$where = process_where($where);

	if (is_array($cols)) {
		$cols = join($cols, ',');
	}

	$sql = "SELECT $cols FROM $table $where";

	return $conn->query($sql);
}

/**
 * Insere uma linha no banco de dados
 */
function insert ($table, $obj)
{
	global $conn;

	$values = '';
	$cols = '';

	foreach ($obj as $column => $value) {
		$values .= $conn->quote($value) . ',';
		$cols .= "`$column`,";
	}

	$values = rtrim($values, ',');
	$cols = rtrim($cols, ',');

	$sql = "INSERT INTO $table ($cols) VALUES ($values)";

	return $conn->query($sql);
}

/**
 * Faz select no banco de dados com o array passado
 */
function update ($table, $values = [], $where = '')
{
	global $conn;

	$set = '';
	$where = process_where($where);

	foreach ($values as $column => $value) {
		$set .= "$column = {$conn->quote($value)},";
	}

	$set = rtrim($set, ',');
	$sql = "UPDATE $table SET $set $where";

	return $conn->query($sql);
}

/**
 * Deleta o registro da tabela
 * (WHERE obrigatório)
 */
function delete ($table, $where)
{
	global $conn;

	$where = process_where($where);
	$sql = "DELETE FROM $table $where";

	return $conn->query($sql);
}

/**
 * Processa o array, montando uma cláusula WHERE
 */
function process_where ($array)
{
	global $conn;
	$where = $array;

	if (is_array($array)) {

		$where = 'WHERE ';

		foreach ($array as $key => $value) {
			$where .= "$key = {$conn->quote($value)} AND ";
		}
	}

	return substr($where, 0, -4);;
}

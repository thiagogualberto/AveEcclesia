<?php
namespace Sistema\Models;

class Agente extends Model
{
	static $belongs_to = ['pessoa', 'funcao', 'comunidade'];
	static $delegate = [
		['nome','dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'email', 'sexo', 'estado_civil', 'to' => 'pessoa'],
		['nome', 'to' => 'funcao', 'prefix' => 'funcao'],
		['nome', 'to' => 'comunidade', 'prefix' => 'comunidade']
	];
}

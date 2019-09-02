<?php
use Sistema\Models\{Dizimista, Membro, Agente, Comunidade, PrestadorServico, Funcionario};
use Sistema\Models\{Batismo, Crisma, Matrimonio};
use Sistema\Models\{Paroquia, Usuario};
use Sistema\Models\{Conta};

function suggestion($req, $res, callable $callback, $default_filter = 'nome') {

	try {
		
		$filter = $req->query('filter', $default_filter);
		$search = $req->query('search');

		// Serializa o objeto para o formato desejado
		$serialize['map'] = function ($value) use ($filter) {
			return $value[$filter];
		};

		// Retorna o objeto de resultado de consulta do callback
		$result = $callback($filter, $search, $req->user->paroquia_id, $serialize);

		// Transforma em json
		$res->json (
			$result->to_array($serialize)
		);

	} catch (Exception $e) {
		$res->send($e);
	}
}

function dizimista_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return Dizimista::all([
			'conditions' => ["dizimistas.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => ['pessoa'],
			'select' => $filter
		]);
	});
}

function dizimo_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return Dizimista::all([
			'conditions' => ["dizimistas.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => ['pessoa'],
			'select' => $filter
		]);
	});
}

function batismo_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {

		if ($filter == 'nome_batismo') {
			return Batismo::all([
				'conditions' => ["batismos.paroquia_id = ? and (nome_batismo LIKE ? || pes.nome LIKE ?)", $paroquia_id, "%$search%", "%$search%"],
				'joins' => [
					'LEFT JOIN pessoas pes ON batismos.pessoa_id = pes.id',
					'LEFT JOIN membros mem ON batismos.pessoa_id = mem.pessoa_id'
				],
				'select' => 'if (nome_batismo=\'\' or nome_batismo is null, pes.nome, nome_batismo) nome_batismo'
			]);
		}		

		return Batismo::all([
			'conditions' => ["batismos.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => [
				'LEFT JOIN pessoas pes ON batismos.pessoa_id = pes.id',
				'LEFT JOIN membros mem ON batismos.pessoa_id = mem.pessoa_id'
			],
			'select' => $filter
		]);
	}, 'nome_batismo');
}

function crisma_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return $result = Crisma::all([
			'conditions' => ["crismas.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => [
				'pessoa',
				'LEFT JOIN membros ON(crismas.pessoa_id = membros.pessoa_id)'
			],
			'select' => $filter
		]);
	});
}

function matrimonio_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return Matrimonio::all([
			'conditions' => ["paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'select' => $filter
		]);
	}, 'noivo_nome');
}

function membros_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return Membro::all([
			'conditions' => ["membros.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => ['pessoa'],
			'select' => $filter
		]);
	});
}

function comunidade_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return Comunidade::all([
			'conditions' => ["paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'select' => $filter
		]);
	});
}

function agente_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return Agente::all([
			'conditions' => ["agentes.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => ['pessoa'],
			'select' => $filter,
			'group' => 'pessoa_id'
		]);
	});
}

function prestadores_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {

		$select = $filter;
		
		if ($filter === 'cpf_cnpj') {
			$select = 'CONCAT(cpf_cnpj, \' - \', nome) cpf_cnpj';
		}

		return PrestadorServico::all([
			'conditions' => ["pessoas.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => ['pessoa'],
			'select' => $select,
			'group' => 'pessoa_id'
		]);
	}, 'nome');
}

function funcionarios_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id, &$serialize) {

		$select = $filter;
		
		if ($filter === 'cpf_cnpj') {
			$select = 'CONCAT(cpf_cnpj, \' - \', nome) cpf_cnpj';
		}

		return Funcionario::all([
			'conditions' => ["funcionarios.paroquia_id = ? and `$filter` LIKE ?", $paroquia_id, "%$search%"],
			'joins' => ['pessoa'],
			'select' => $select,
			'group' => 'pessoa_id'
		]);
	});
}

function contas_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search, $paroquia_id) {
		return Conta::find_by_sql(
			"SELECT $filter FROM contas WHERE paroquia_id = ? and `$filter` LIKE ?",
			[ $paroquia_id, "%$search%" ]
		);
	});
}

function paroquia_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search) {
		return Paroquia::all([
			'conditions' => ["`$filter` LIKE ?", "%$search%"],
			'select' => $filter
		]);
	});
}

function usuario_suggestion($req, $res)
{
	suggestion($req, $res, function ($filter, $search) {
		return Usuario::all([
			'conditions' => ["`$filter` LIKE ?", "%$search%"],
			'select' => $filter
		]);
	});
}
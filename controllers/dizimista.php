<?php
include_once 'lib/query.php';

use Sistema\Models\{Dizimista, Dizimo, Membro};

// GET /api/dizimista
function dizimista_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'nome'),
			'filter' => $req->query('filter', 'nome'),
			'joins' => ['pessoa']
		];

		$serialize = [
			'delegate' => ['nome', 'dt_nascimento', 'comunidade_nome']
		];

		$result = Dizimista::filter($req, $options, $serialize);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/dizimista/membros
function membros_dizimista_list($req, $res)
{
	try {

		$paroquia_id = $req->user->paroquia_id;
		$search = $req->query('search', '');

		$result = Membro::find_by_sql("CALL obter_membros_nao_dizimista(?, ?)", [$paroquia_id, $search]);
		$res->json([
			'success' => true,
			'rows' => $result->to_array()
		]);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/dizimista/:id
function dizimista_get($req, $res)
{
	try {

		$dizimista = Dizimista::find($req->params->id);
		
		if ($dizimista) {
			$res->json($dizimista->to_array());
		} else {
			throw new Exception('Dizimista não encontrado!');
		}
		
	} catch (Exception $e) {
		$res->json(['success' => true, 'message' => $e->getMessage()]);
	}
}

// PUT /api/dizimista/:id
function dizimista_put($req, $res)
{
	try {

		// Atualiza o dizimista
		$dizimista = Dizimista::find($req->params->id);
		$result = $dizimista->update_attributes($req->body);

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Dizimista atualizado com sucesso!',
				'data' => $dizimista->to_array()
			]);
		} else {
			throw new Exception('Registro com id='.$req->params->id.' não encontrado!');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/dizimista
function dizimista_post($req, $res)
{
	try {

		if (Dizimista::exists(['pessoa_id' => $req->body->pessoa_id])) {
			throw new Exception('O membro informado já é dizimista!');
		}
		
		$dizimista = new Dizimista($req->body);
		$dizimista->paroquia_id = $req->user->paroquia_id;
		$dizimista->codigo = time();
		$result = $dizimista->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Dizimista adicionado com sucesso!']);
		} else {
			throw new Exception('Erro ao inserir registro! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/dizimista/:id
function dizimista_delete($req, $res)
{
	try {

		$dizimista = Dizimista::find($req->params->id);
		$resp = $dizimista->delete();
		
		if ($resp) {
			$res->json(['success' => true, 'message' => 'Dizimista apagado com sucesso']);
		} else {
			throw new Exception('Dizimista não encontrado!');
		}
		
	} catch (Exception $e) {
		$res->json(['success' => true, 'message' => $e->getMessage()]);
	}
}

// GET /api/dizimista/:pessoa_id/dizimos
function dizimista_dizimos($req, $res)
{
	try {

		$options = [
			'conditions' => [
				'paroquia_id = ? AND pessoa_id = ?',
				$req->user->paroquia_id,
				$req->params->pessoa_id
			],
			'sort' => $req->query('sort', 'dt_pagamento')
		];

		$result = Dizimo::filter($req, $options);
		$res->json($result);
		
	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

function dizimista_nivers($req, $res) {

	$year = date('Y', strtotime($req->query->start_date));

	$options = [
		'joins' => ['pessoa'],
		'select' => 'nome, dt_nascimento',
		'conditions' => [
			"DATE_FORMAT(dt_nascimento, '$year-%m-%d') BETWEEN ? AND ? AND dizimistas.paroquia_id = ? AND ativo = 1",
			$req->query->start_date,
			$req->query->end_date,
			$req->user->paroquia_id
		]
	];

	// Consulta os dizimistas da paroquia
	$dizimistas = Dizimista::all($options)->to_array();
	$res->json($dizimistas);
}

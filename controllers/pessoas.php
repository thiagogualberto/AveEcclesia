<?php
use Sistema\Models\Pessoa;

// GET /api/pessoas
function pessoas_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'nome'),
			'filter' => $req->query('filter', 'nome'),
			'conditions' => ['paroquia_id = ?', $req->user->paroquia_id]
		];

		$result = Pessoa::filter($req, $options);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/pessoas/:id
function pessoas_get($req, $res)
{
	$pessoa = Pessoa::find($req->params->id);
	$result = $pessoa->to_array();
	$result['nmsexo'] = $pessoa->nmsexo;

	$res->json($result);
}

// PUT /api/pessoas/:id
function pessoas_put($req, $res)
{
}

// POST /api/pessoas
function pessoas_post($req, $res)
{
}

// DELETE /api/pessoas/:id
function pessoas_delete($req, $res)
{
}

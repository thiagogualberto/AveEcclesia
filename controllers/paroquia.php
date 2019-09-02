<?php
use Sistema\Models\{Paroquia, Pessoa};

// GET /api/paroquia
function paroquia_list($req, $res)
{
	try {

		$search = $req->query('search');
		$sort = $req->query('sort', 'nome');
		$filter = $req->query('filter', 'nome');
		$options = [
			'conditions' => [
				"`$filter` LIKE ?",
				"%$search%"
			]
		];
		$serialize = [ 'delegate' => [ 'diocese_nome' ] ];

		$result = Paroquia::all(array_merge($options, [
			'limit' => $req->query('limit', 10),
			'offset' => $req->query('offset', 0),
			'order' => $sort
		]));

		$res->json([
			'total' => Paroquia::count($options),
			'rows' => $result->to_array($serialize)
		]);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/paroquia/:id
function paroquia_get($req, $res)
{
	try {
		
		$paroquia = Paroquia::find($req->params->id);	
		$res->json($paroquia->to_array());

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/paroquia/:id
function paroquia_put($req, $res)
{
	try {

		$paroquia = Paroquia::find($req->params->id);
		$result = $paroquia->update_attributes($req->body);

		if ($result) {
			$res->json([
				'success' => true,
				'message' => 'Paroquia '.$paroquia->nome.' atualizada com sucesso!',
				'data' => $paroquia->to_array()
			]);
		} else {
			throw new  Exception('Erro ao editar paroquia! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/paroquia
function paroquia_post($req, $res)
{
	try {

		$paroquia = new Paroquia($req->body);
		$paroquia->paroquia_id = $req->user->paroquia->id;
		$result = $paroquia->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Paroquia '.$paroquia->nome.' adicionada com sucesso!']);
		} else {
			throw new  Exception('Erro ao inserir registro! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/paroquia/:id
function paroquia_delete($req, $res)
{
	try {

		$paroquia = Paroquia::find($req->params->id);
		$result = $paroquia->delete();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Paroquia '.$paroquia->nome.' excluída com sucesso']);
		} else {
			throw new  Exception('Erro ao excluir registro! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

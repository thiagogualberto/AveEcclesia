<?php
use Sistema\Models\{Comunidade, Pessoa};

// GET /api/comunidade
function comunidade_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'nome'),
			'filter' => $req->query('filter', 'nome'),
			'conditions' => ['paroquia_id = ?', $req->user->paroquia_id]
		];

		$result = Comunidade::filter($req, $options);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/comunidade/:id
function comunidade_get($req, $res)
{
	try {
		
		$comunidade = Comunidade::find($req->params->id);	
		$res->json($comunidade->to_array());

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/comunidade/:id
function comunidade_put($req, $res)
{
	try {

		$comunidade = Comunidade::find($req->params->id);
		$result = $comunidade->update_attributes($req->body);

		if ($result) {
			$res->json(['success' => true, 'message' => 'Comunidade '.$comunidade->nome.' atualizada com sucesso!']);
		} else {
			throw new  Exception('Erro ao editar comunidade! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/comunidade
function comunidade_post($req, $res)
{
	try {

		$comunidade = new Comunidade($req->body);
		$comunidade->paroquia_id = $req->user->paroquia->id;
		$result = $comunidade->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Comunidade '.$comunidade->nome.' adicionada com sucesso!']);
		} else {
			throw new  Exception('Erro ao inserir registro! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/comunidade/:id
function comunidade_delete($req, $res)
{
	try {

		$comunidade = Comunidade::find($req->params->id);
		$result = $comunidade->delete();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Comunidade '.$comunidade->nome.' excluída com sucesso']);
		} else {
			throw new  Exception('Erro ao excluir registro! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

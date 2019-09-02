<?php
use Sistema\Models\Agente;

// GET /api/agentes
function agentes_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'nome'),
			'filter' => $req->query('filter', 'nome'),
			'joins' => ['pessoa']
		];

		$serialize = [
			'delegate' => ['nome', 'funcao_nome', 'comunidade_nome']
		];

		$result = Agente::filter($req, $options, $serialize);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/agentes/:id
function agentes_get($req, $res)
{
	try {
		
		$agente = Agente::find([
			'conditions' => ['agentes.id = ?', $req->params->id],
			'select' => '*',
			'joins' => ['pessoa']
		]);
	
		$res->json($agente->to_array(['include' => 'pessoa']));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/agentes/:id
function agentes_put($req, $res)
{
	$agente = Agente::find($req->params->id);
	$result = $agente->update_attributes($req->body);

	if ($result) {
		$res->json(['success' => true, 'message' => 'Agente atualizado com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Agente com id='.$req->params->id.' não encontrado!']);
	}
}

// POST /api/agentes
function agentes_post($req, $res)
{
	try {

		$agente = new Agente($req->body);
		$agente->paroquia_id = $req->user->paroquia_id;
		$result = $agente->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!']);
		} else {
			$res->json(['success' => false, 'message' => 'Erro ao inserir registro! Tente novamente mais tarde.']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}

	// $query = insert('pessoal', $req->body);
	// $res->json($query->fetch(PDO::FETCH_OBJ));
}

// DELETE /api/agentes/:id
function agentes_delete($req, $res)
{
	$agente = Agente::find($req->params->id);
	$result = $agente->delete();

	if ($result) {
		$res->json(['success' => true, 'message' => 'Agente apagado com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Agente com id='.$req->params->id.' não encontrado!']);
	}
}

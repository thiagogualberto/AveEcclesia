<?php
use Sistema\Models\Usuario;

// GET /api/users
function users_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'nome'),
			'filter' => $req->query('filter', 'nome'),
			'conditions' => [ 'paroquia_id is not null' ]
		];

		$serialize = [
			'except' => 'senha',
			'delegate' => ['paroquia_nome']
		];

		$result = Usuario::filter($req, $options, $serialize);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/users/:id
function users_get($req, $res)
{
	try {
		
		$user = Usuario::find($req->params->id);
		$res->json($user->to_array(['except' => 'senha']));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/users/:id
function users_put($req, $res)
{
	$user = Usuario::find($req->params->id);
	$result = $user->update_attributes($req->body);
	
	if ($result) {
		
		$data = $user->to_array([ 'except' => 'senha', 'include' => 'paroquia' ]);
			
		if ($req->params->id == $req->user->id) {
			$_SESSION['user'] = $data;
		}

		$res->json([
			'success' => true,
			'message' => 'Usuario atualizado com sucesso',
			'data' => $data
		]);
	} else {
		$res->json(['success' => false, 'message' => 'Usuario com id='.$req->params->id.' não encontrado!']);
	}
}

// POST /api/users
function users_post($req, $res)
{
	try {

		$user = new Usuario($req->body);
		$user->raw_password = $req->body->senha;
		$result = $user->save();

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!']);
		} else {
			$res->json(['success' => false, 'message' => 'Erro ao inserir registro! Tente novamente mais tarde.']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/users/:id
function users_delete($req, $res)
{
	$user = Usuario::find($req->params->id);
	$result = $user->delete();

	if ($result) {
		$res->json(['success' => true, 'message' => 'Usuario apagado com sucesso']);
	} else {
		$res->json(['success' => false, 'message' => 'Usuario com id='.$req->params->id.' não encontrado!']);
	}
}

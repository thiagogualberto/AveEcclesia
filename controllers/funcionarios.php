<?php
use Sistema\Models\{Funcionario, Pessoa};

// GET /api/funcionarios
function funcionarios_list($req, $res)
{
	try {

		$filter = $req->query('filter', 'nome');
		$search = $req->query('search');
		$sort = $req->query('sort', 'nome');

		if ($filter === 'cpf_cnpj') {
			$req->query->search = preg_replace('/(.*) - .*/', '$1', $search);
		}

		$options = [
			'sort' => preg_replace('/(\w+)\.(.*)/', '$2', $sort),
			'filter' => $filter,
			'joins' => ['pessoa']
		];
	
		$result = Funcionario::filter($req, $options, ['include' => 'pessoa']);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/funcionarios/:id
function funcionarios_get($req, $res)
{
	try {
		
		$membro = Funcionario::find($req->params->id);	
		$res->json($membro->to_array(['include' => 'pessoa']));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/funcionarios/:id
function funcionarios_put($req, $res)
{
	try {

		// Atualiza o prestador
		$funcionario = Funcionario::find($req->params->id);
		$result = $funcionario->update_attributes($req->body);

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro atualizado com sucesso!']);
		} else {
			$res->json(['success' => false, 'message' => 'Registro com id='.$req->params->id.' não encontrado!']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/funcionarios
function funcionarios_post($req, $res)
{
	try {

		// Remove os campos desnecessários
		$pessoa = array_remove($req->body, 'pessoa');

		// Cria uma nova pessoa
		$pessoa = new Pessoa($pessoa);
		$pessoa->paroquia_id = $req->user->paroquia_id;
		$pessoa->save();

		// Cria um novo prestador de serviço
		$funcionario = new Funcionario($req->body);
		$funcionario->pessoa_id = $pessoa->id;
		$funcionario->paroquia_id = $req->user->paroquia_id;
		$result = $funcionario->save();
		
		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!']);
		} else {
			$res->json(['success' => false, 'message' => 'Erro ao inserir registro! Tente novamente mais tarde.']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/funcionarios/:id
function funcionarios_delete($req, $res)
{
	$funcionario = Funcionario::find($req->params->id);
	$funcionario->pessoa->delete();
	$funcionario->delete();

	$res->json(['success' => true, 'message' => 'Registro excluído com sucesso']);
}
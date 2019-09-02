<?php
use Sistema\Models\{PrestadorServico, Pessoa};

// GET /api/prestadores
function prestadores_list($req, $res)
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
	
		$result = PrestadorServico::filter($req, $options, ['include' => 'pessoa']);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/prestadores/:id
function prestadores_get($req, $res)
{
	try {
		
		$membro = PrestadorServico::find($req->params->id);	
		$res->json($membro->to_array(['include' => 'pessoa']));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/prestadores/:id
function prestadores_put($req, $res)
{
	try {

		// Atualiza o prestador
		$prestador = PrestadorServico::find($req->params->id);
		$result = $prestador->update_attributes($req->body);

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro atualizado com sucesso!']);
		} else {
			$res->json(['success' => false, 'message' => 'Registro com id='.$req->params->id.' não encontrado!']);
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/prestadores
function prestadores_post($req, $res)
{
	try {

		// Dados do novo prestador de serviço
		$data = $req->body;
		$paroquia_id = $data->paroquia_id = $req->user->paroquia_id;
		$cpf_cnpj = $data->pessoa->cpf_cnpj;

		$options = [
			'joins' => ['pessoa'],
			'conditions' => [
				'prestadores_servico.paroquia_id = ? AND cpf_cnpj = ?',
				$paroquia_id, $cpf_cnpj
			]
		];

		if (PrestadorServico::exists($options)) {
			throw new Exception('Já existe um registro com o CPF/CNPJ "'.$cpf_cnpj.'" no sistema!');
		}
		
		// Remove os campos desnecessários
		$pessoa = array_remove($data, 'pessoa');

		// Cria uma nova pessoa
		$pessoa = new Pessoa($pessoa);
		$pessoa->paroquia_id = $paroquia_id;
		$pessoa->save();

		// Cria um novo prestador de serviço
		$prestador = new PrestadorServico($data);
		$prestador->pessoa_id = $pessoa->id;
		$result = $prestador->save();
		
		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!']);
		} else {
			throw new Exception('Erro ao inserir registro! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// DELETE /api/prestadores/:id
function prestadores_delete($req, $res)
{
	$prestador = PrestadorServico::find($req->params->id);
	$prestador->pessoa->delete();
	$prestador->delete();

	$res->json(['success' => true, 'message' => 'Registro excluído com sucesso']);
}
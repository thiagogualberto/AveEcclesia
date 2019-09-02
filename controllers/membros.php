<?php
use Sistema\Models\{Pessoa, Membro, Dizimista, Batismo, Crisma, Matrimonio};

// GET /api/membros
function membros_list($req, $res)
{
	try {

		$options = [
			'sort' => $req->query('sort', 'nome'),
			'filter' => $req->query('filter', 'nome'),
			'joins' => ['pessoa']
		];

		// Filtra por sexo
		if ($sexo = $req->query('sexo')) {
			$options['conditions'] = ['sexo = ?', $sexo];
		}

		$serialize = [
			'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil']
		];

		$result = Membro::filter($req, $options, $serialize);
		$res->json($result);

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => 'Nenhum registro encontrado!',
			'exception' => $e->getMessage()
		]);
	}
}

// GET /api/membros/:pessoa_id
function membros_get($req, $res)
{
	try {

		$serialize = [
			'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil']
		];

		$membro = Membro::pessoa($req->params->id);
		$res->json($membro->to_array($serialize));

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// PUT /api/membros/:pessoa_id
function membros_put($req, $res)
{
	try {

		$serialize = [
			'delegate' => ['nome', 'dt_nascimento', 'rg', 'cpf_cnpj', 'tel', 'cel', 'sexo', 'estado_civil']
		];

		$membro = Membro::pessoa($req->params->id);
		$membro->update_attributes($req->body);

		if ($membro) {
			$res->json(['success' => true, 'message' => 'Membro atualizado com sucesso', 'data' => $membro->to_array($serialize)]);
		} else {
			throw new Exception('Usuario com id='.$req->params->id.' não encontrado!');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/membros
function membros_post($req, $res)
{
	try {

		$mae = $req->body('mae', '');
		$nome = $req->body('nome');

		$options = [
			'joins' => ['pessoa'],
			'conditions' => [
				'membros.paroquia_id = ? AND nome LIKE ? AND mae LIKE ?',
				$req->user->paroquia_id, $nome, "%$mae%"
			]
		];

		if (Membro::exists($options)) {
			throw new Exception('Já existe um registro "'.$nome.'" no sistema!');
		}

		$data = $req->body;
		
		$pessoa = remove_fields($data, 'nome,dt_nascimento,sexo,estado_civil');
		$pessoa->paroquia_id = $req->user->paroquia_id;
		$pessoa = Pessoa::create($pessoa);

		$data->paroquia_id = $req->user->paroquia_id;
		$data->pessoa_id = $pessoa->id;
		$result = Membro::create($data);
		
		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro adicionado com sucesso!']);
		} else {
			throw new Exception('Erro ao inserir registro! Tente novamente mais tarde.');
		}

	} catch (Exception $e) {
		$res->json([
			'success' => false,
			'message' => $e->getMessage()
		]);
	}
}

// DELETE /api/membros/:id
function membros_delete($req, $res)
{
	try {

		$membro = Membro::find($req->params->id);
	
		$membro->pessoa->delete();
		$membro->delete();
	
		$res->json(['success' => true, 'message' => 'Registro excluído com sucesso']);

	} catch (Exception $e) {

		$message = $e->getMessage();

		// Verifica se foi uma falha de foreign key
		if (strpos($message, 'Integrity constraint violation') !== false) {
			$message = 'Proibida exclusão, esse membro possui sacramentos';
		}

		$res->json(['success' => false, 'message' => $message]);
	}
}

// GET /api/membros/:pessoa_id/dizimista
function membro_dizimista($req, $res)
{
	try {
		
		$dizimista = Dizimista::find_by_pessoa_id($req->params->id);

		if ($dizimista) {
			$res->json($dizimista->to_array([ 'delegate' => [ 'comunidade_nome' ] ]));
		} else {
			$res->json(false);
		}

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// GET /api/membros/:pessoa_id/batismo
function membro_batismo($req, $res)
{
	try {
		
		$membro = Membro::pessoa($req->params->id);

		if ($membro->batismo) {
			$res->json($membro->batismo->to_array());
		} else {
			$res->json(false);
		}

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// GET /api/membros/:pessoa_id/crisma
function membro_crisma($req, $res)
{
	try {
		
		$membro = Membro::pessoa($req->params->id);

		if ($membro->crisma) {
			$res->json($membro->crisma->to_array());
		} else {
			$res->json(false);
		}

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

// GET /api/membros/:pessoa_id/matrimonio
function membro_matrimonio($req, $res)
{
	try {

		// Pesquisa pelo membro
		$membro = Membro::pessoa($req->params->id);

		// Se for homem, pesquisa pelo noivo_id, senão pelo noiva_id
		if ($membro->sexo == 'M') {
			$matrimonio = Matrimonio::find_by_noivo_id($membro->pessoa_id);	
		} else {
			$matrimonio = Matrimonio::find_by_noiva_id($membro->pessoa_id);	
		}

		// Retorna o matrimonio ou false
		if ($matrimonio) {
			$res->json($matrimonio->to_array());
		} else {
			$res->json(false);
		}

	} catch (Exception $e) {
		$res->json($e->getMessage());
	}
}

function remove_fields(&$array, $fields)
{
	$fields = explode(',', $fields);
	
	if (is_array($array))
	{
		$tmp = [];
		foreach ($fields as $field) {
			$tmp[$field] = $array[$field];
			unset($array[$field]);
		}
	}
	else
	{
		$tmp = new stdClass;
		foreach ($fields as $field) {
			$tmp->$field = $array->$field;
			unset($array->$field);
		}
	}

	return $tmp;
}

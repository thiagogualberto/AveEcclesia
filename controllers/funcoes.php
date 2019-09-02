<?php
include_once 'lib/query.php';

use Sistema\Models\Funcao;

// GET /api/funcoes
function funcoes_list($req, $res)
{
	$filter = $req->query('filter', 'nome');
	$search = $req->query('search');

	$options = [
		'conditions' => [
			"diocese_id = ? AND `$filter` LIKE ?", $req->user->diocese_id, "%$search%"
		]
	];

	if (isset($req->query->ativo)) {
		$options['conditions'][0] .= ' AND ativo = ' . $req->query->ativo;
	}

	try {

		$funcoes = Funcao::all($options);
		$res->json([
			'success' => true,
			'rows' => $funcoes->to_array()
		]);

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => 'Erro ao pesquisar por funções']);
	}
}

// GET /api/funcoes/:id
function funcoes_get($req, $res)
{
	try {

		$funcao = Funcao::find($req->params->id);
		$res->json($funcao->to_array());

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => 'Função não encontrada']);
	}
}

// PUT /api/funcoes/:id
function funcoes_put($req, $res)
{
	try {

		// Atualiza a função
		$funcoes = Funcao::find($req->params->id);
		$result = $funcoes->update_attributes($req->body);

		if ($result) {
			$res->json(['success' => true, 'message' => 'Registro atualizado com sucesso!']);
		} else {
			throw new Exception('Registro com id='.$req->params->id.' não encontrado!');
		}

	} catch (Exception $e) {
		$res->json(['success' => false, 'message' => $e->getMessage()]);
	}
}

// POST /api/funcoes
function funcoes_post($req, $res)
{
	$funcao = $req->body;
	$funcao->diocese_id = $req->user->diocese_id;
	$funcao->ativo = 0;

	$query = insert('funcoes', $funcao);
	$res->json($query->fetch(PDO::FETCH_OBJ));
}

// DELETE /api/funcoes/:id
function funcoes_delete($req, $res)
{
	$query = delete('funcoes', ['id' => $req->params->id]);
	$res->json(['success' => true, 'message' => 'Registro apagado com sucesso']);
}

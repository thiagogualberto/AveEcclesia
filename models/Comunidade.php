<?php
namespace Sistema\Models;

class Comunidade extends Model
{
	public function dizimos($dizimo_id, $start_date, $end_date) {
		return Dizimo::find_by_sql(
			'SELECT rec.*, pes.nome FROM receitas rec
			INNER JOIN dizimistas diz ON diz.pessoa_id = rec.pessoa_id
			INNER JOIN pessoas pes ON pes.id = rec.pessoa_id
			WHERE pes.paroquia_id = ? AND comunidade_id = ? AND plano_contas = ? AND dt_pagamento BETWEEN ? AND ? AND quitado = true',
			[ $this->paroquia_id, $this->id, $dizimo_id, $start_date, $end_date ]
		);
	}
}

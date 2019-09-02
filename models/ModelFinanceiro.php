<?php
namespace Sistema\Models;

class ModelFinanceiro extends Model
{
	static $before_create = ['update_saldo_create'];
	static $before_update = ['update_saldo_update'];
	static $before_destroy = ['update_saldo_delete'];

	/**
	 * Filtra os dados de acordo com a necessidade do AveEcclesia
	 */
	public static function filter($req, array $options = [], array $serialize_options = [])
	{
		$cond = $options['conditions'];

		switch ($req->query('status', 'todas')) {
			case 'pago':
				$cond[0] .= ' AND quitado = true';
				break;
			case 'pendente':
				$cond[0] .= ' AND quitado = false';
				break;
			case 'vencer':
				$cond[0] .= ' AND dt_vencimento = ? AND quitado = false';
				$cond[] = date('Y-m-d');
				break;
			case 'atraso':
				$cond[0] .= ' AND dt_vencimento = ? AND quitado = false';
				$cond[] = date('Y-m-d', strtotime('-1 days'));
		}

		$options['conditions'] = $cond;

		return parent::filter($req, $options, $serialize_options);
	}

	public function update_saldo_create(){}
	public function update_saldo_update(){}
	public function update_saldo_delete(){}
}

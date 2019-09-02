export default [
	{
		title: 'Receitas',
		action: 'receitas',
		color: '#28a745',
		btnType: 'outline-success',
		btnTitle: 'Adicionar receita',
		thead: [
			{ title: 'Data', width: 168 },
			{ title: 'Descrição' },
			{ title: 'Recebido de', width: 200 },
			{ title: 'Valor Recebido', width: 154 },
			{ title: 'Categoria', width: 200 },
			{ title: 'Pago?', width: 74 },
			{ title: '\xa0', width: 50 }
		]
	},
	{
		title: 'Despesas',
		action: 'despesas',
		color: '#dc3545',
		btnType: 'outline-danger',
		btnTitle: 'Adicionar despesa',
		thead: [
			{ title: 'Data', width: 168 },
			{ title: 'Descrição' },
			{ title: 'Pago a', width: 270 },
			{ title: 'Valor Pago', width: 144 },
			{ title: 'Categoria', width: 200 },
			{ title: 'Pago?', width: 74 },
			{ title: '\xa0', width: 50 }
		]

	},
	{
		title: 'Transferências',
		action: 'transferencias',
		color: '#007bff',
		btnType: 'outline-primary',
		btnTitle: 'Adicionar transferência',
		thead: [
			{ title: 'Data' },
			{ title: 'Descrição' },
			{ title: 'Valor' },
			{ title: 'Conta de origem' },
			{ title: 'Conta de destino' },
			{ title: 'Pago?' },
			{ title: '\xa0' }
		]
	}
]
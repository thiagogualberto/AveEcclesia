(function ($) {

	$.put = function (url, data = {}, callback) {

		return $.ajax({
			type: 'PUT',
			url: url,
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: callback
		})
	}
 
	$.delete = function (url, callback) {

		return $.ajax({
			type: 'DELETE',
			url: url,
			contentType: 'application/json',
			success: callback
		})
	}

})(jQuery)

function table_url(id = '') {

	const data = $('.table').bootstrapTable('getOptions')
	const url = data.url.replace(/(.*)\?.*/, '$1')

	if (id) {
		return url + '/' + id
	}
	
	return url
}

function call_format(method, row, default_msg) {
	if (window.format[method] != undefined) {
		return format[method](row)
	} else {
		return default_msg
	}
}

function mount_table (path = undefined, config = {}) {

	const $table = $(path || '.table[data-url]')

	if (window.tableOptions == undefined) {
		window.tableOptions = {}
	}

	if (window.format == undefined) {
		window.format = {}
	}

	table.click('.delete', (e, value, row, index) => {
		
		const $td = $(e.target).closest('td')
		const $container = $td.find('.btn-container')
		const $loading = $td.find('.fa')

		if (!confirm(call_format('delete_message', row, 'Você deseja mesmo excluir "' + row.nome + '"?'))) {
			return
		}

		// Mostra o loading
		$container.addClass('d-none')
		$loading.removeClass('d-none')

		// Exclui o registro
		$.delete(table_url(row.id), resp => {
			if (resp.success) {
				// $('table').bootstrapTable('removeByUniqueId', row.id)
				$('.table').bootstrapTable('refresh', { silent: true })
				add_notification('success', resp.message)
			} else {
				add_notification('danger', resp.message)
			}

			// Remove o loading
			$container.removeClass('d-none')
			$loading.addClass('d-none')
		})
	})

	table.click('.status', (e, value, row, index) =>  {

		const $td = $(e.target).closest('td')
		const $container = $td.find('.btn-container')
		const $loading = $td.find('.fa')

		// Mostra o loading
		$container.addClass('d-none')
		$loading.removeClass('d-none')

		// Atualiza o registro
		$.put(table_url(row.id), { ativo: !(row.ativo == 1) }, function (resp) {

			// Recarrega os registros
			$('table').bootstrapTable('refresh', { silent: true })

			// Remove o loading
			$container.removeClass('d-none')
			$loading.addClass('d-none')
		})
	})

	$table.bootstrapTable({
		classes: 'table-hover table-striped table-no-bordered',
		pagination: true,
		sideSort: false,
		sidePagination: 'server',
		rememberOrder: true,
		paginationLoop: false,
		iconsPrefix: 'fa',
		paginationPreText: 'Anterior',
		paginationNextText: 'Próxima',
		formatLoadingMessage: () => '<div class="spinner-border spinner-border-sm text-primary" role="status" /> Carregando dados...',
		onClickRow: function (row, $element, field) {
			
			if (this.detalhes) {

				// Pega a url
				const url = uri_params(this.detalhes, row)

				// Executa no smoothstate ou manda direto
				if (window.smoothState) {
					smoothState.load(url)
				} else {
					location.href = url
				}
			}
		},
		onPostBody: function () {
			$('.table td').dateFormat()
		},
		...tableOptions,
		...config
	})

	delete tableOptions
}

function Action (fa_icon, title, color, options = {}) {

	const icon = document.createElement('i')
	const button = document.createElement('button')
	const {className, id, ...dataset} = options

	icon.className = 'fa fa-' + fa_icon;

	button.type = 'button'
	button.className = 'icon-action btn btn-link ' + className
	button.title = title
	button.appendChild(icon);
	button.style.color = color

	if (dataset != undefined) {
		for (let key in dataset) {
			button.dataset[key] = dataset[key]
		}
	}

	return button;
}

function Button(fa_icon, title, color, className, disabled) {

	const button = document.createElement('a')

	button.href = '#'
	button.role = 'button'
	button.className = 'dropdown-item ' + className + (disabled ? ' disabled' : '')
	button.innerHTML = '<i class="fa fa-' + fa_icon + '"></i>' + title
	button.style.color = color

	return button;
}

function Header(title) {

	const h6 = document.createElement('h6')
	h6.className = 'dropdown-header'
	h6.innerText = title

	return h6
}

function Divider() {
	
	const div = document.createElement('div')
	div.className = 'dropdown-divider'

	return div
}

function Actions (condition, action1, action2) {
	return condition ? Action(...action1) : Action(...action2)
}

function Buttons (condition, action1, action2) {
	return condition ? Button(...action1) : Button(...action2)
}

function render_actions(value, row, index, field) {

	const acts = actions(value, row, index, field)
	let outerHTML = '';

	for (let action of acts) {
		outerHTML += action.outerHTML
	}

	return (
		'<div class="btn-container">'
			+ outerHTML +
		'</div>' +
		'<i class="fa fa-spinner fa-spin d-none"></i>'
	)
}

function render_buttons(value, row, index, field) {

	const btns = buttons(value, row, index, field)
	let outerHTML = `<div class="btn-group"><a href="#" class="btn btn-outline-secondary btn-sm dropdown-toggle" id="dropdown-${index}" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Ações</a><div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-${index}">`;

	for (let button of btns) {
		if (button) {
			outerHTML += button.outerHTML
		}
	}

	return outerHTML + '</div></div>'
}

function render_inativo(value, row, index, field) {
	return row.ativo == 1 ? value : '<del>' + value + '</del>'
}

function money_format(value) {
	return 'R$ ' + (0 + value).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function membro_format(val, row) {
	const url = mounturl + '/cadastro/membros/' + row.pessoa_id
	return '<a href="' + url + '">' + val + '</a>'
}

function membro_detalhes(val, row) {
	return membro_format(render_inativo(val, row), row)
}

function uri_params(uri, object) {
	
	var ocurr = uri.match(/:(\w+)/g)

	ocurr.map(item => {
		var key = item.replace(':', '')
		uri = uri.replace(item, object[key])
	})

	return uri
}

mount.add(mount_table)

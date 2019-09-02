import React, { PureComponent } from 'react'
import isEqual from 'lodash/isEqual'

import api from '../../api'

window.format = {}

function call_format(method, row, default_msg) {
	if (window.format[method] != undefined) {
		return format[method](row)
	} else {
		return default_msg
	}
}

class BootstrapTable extends PureComponent {

	constructor(props) {
		super(props)
		window.events = {}
		this.on('delete', this.delete_item)
		this.on('status', this.status_item)
	}

	componentDidUpdate(prevProps) {

		// Pega os parâmetros de busca
		const prevParams = this.props.queryParams()
		const nextParams = prevProps.queryParams()

		// Apenas atualiza se forem diferentes
		if (!isEqual(prevParams, nextParams)) {
			this.bootstrapTable('refreshOptions', {
				queryParams: this.props.queryParams
			})
		}
	}

	refresh = (options = {}) => {
		this.bootstrapTable('refresh', { ...options })
	}

	bootstrapTable = (method, parameter) => {
		this.$elem.bootstrapTable(method, parameter)
	}

	delete_item = (e, value, row) => {

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
		this.request({
			url: this.props.url + '/' + row.id,
			type: 'delete',
			success: data => {

				if (data.success) {
					add_notification('success', data.message)
				} else {
					add_notification('danger', data.message)
				}

				// Remove o loading
				$container.removeClass('d-none')
				$loading.addClass('d-none')
			},
			finally: () => {
				// Recarrega os registros
				this.refresh({ silent: true })
			}
		})
	}

	status_item = (e, value, row) => {

		const $td = $(e.target).closest('td')
		const $container = $td.find('.btn-container')
		const $loading = $td.find('.fa')
		const field = $(e.target).closest('button').data('field') || 'id'

		// Mostra o loading
		$container.addClass('d-none')
		$loading.removeClass('d-none')

		// Atualiza o registro
		this.request({
			type: 'put',
			url: this.props.url + '/' + row[field],
			_data: { ativo: row.ativo == 1 ? 0 : 1 },
			success: () => {
				// Remove o loading
				$container.removeClass('d-none')
				$loading.addClass('d-none')
			},
			finally: () => {
				// Recarrega os registros
				this.refresh({ silent: true })
			}
		})
	}

	request = async params => {
		
		try {

			// Cria o request
			const resp = await api.request({
				method: params.type,
				params: params.data,
				data: params._data,
				url: params.url
			})
	
			// Chama quando sucesso
			params.success(resp.data)

		} catch (e) {
			params.error(e)
		} finally {
			if (params.finally) params.finally()
		}
	}

	on = (name, callback) => {
		window.events[`click .${name}`] = function (e, value, row, index) {
			e.preventDefault()
			e.stopPropagation()
			callback(e, value, row, index)
		}
	}

	render = () => (
		<table ref={el => this.table = el} className='table' data-url={this.props.url}>
			<thead>
				<tr>{this.props.children}</tr>
			</thead>
		</table>
	)

	componentDidMount() {
		this.$elem = $(this.table).bootstrapTable({
			events: '__events',
			ajax: this.request,
			detailView: this.props.detailView,
			showToggle: this.props.showToggle,
			showFullscreen: this.props.showFullscreen,
			classes: this.props.classes,
			pagination: this.props.pagination,
			sideSort: this.props.sideSort,
			sortName: this.props.sortName,
			sortOrder: this.props.sortOrder,
			sidePagination: this.props.sidePagination,
			rememberOrder: this.props.rememberOrder,
			paginationLoop: this.props.paginationLoop,
			queryParams: this.props.queryParams,
			formatLoadingMessage: () => '<div class="spinner-border spinner-border-sm text-primary" role="status" /> Carregando dados...',
			iconsPrefix: 'fa',
			paginationPreText: 'Anterior',
			paginationNextText: 'Próxima',
		})
	}

	componentWillUnmount() {
		this.bootstrapTable('destroy')
	}
}

BootstrapTable.defaultProps = {
	url: '',
	classes: 'table-hover table-striped table-no-bordered',
	pagination: true,
	sortOrder: 'asc',
	sideSort: false,
	sidePagination: 'server',
	rememberOrder: true,
	paginationLoop: false,
	iconsPrefix: 'fa',
	paginationPreText: 'Anterior',
	paginationNextText: 'Próxima',
	queryParams: () => { }
}

export { default as Field } from './Field'
export { default as Action } from './Action'
export { default as Button } from './Button'
export { default as Header } from './Header'
export { default as Divider } from './Divider'
export { default as Actions } from './Actions'
export { default as Buttons } from './Buttons'
export { default as ActionToggle } from './ActionToggle'

export default BootstrapTable

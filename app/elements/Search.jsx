import React, { PureComponent, Fragment } from 'react'
import { Row, Col, Button, FormGroup, CustomInput, ButtonToolbar } from 'reactstrap'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import api, { handler } from '../api';

class Search extends PureComponent {

	static defaultProps = {
		url: '',
		filters: [],
		onSearch: () => { },
		onChangeFilter: () => { }
	}

	constructor(props) {
		super(props)
		this.renderToolbar = props.renderToolbar || this.renderToolbar
		this.state = {
			options: [],
			loading: false,
			search: props.defaultSearch,
			filter: props.defaultFilter,
		}
	}

	handleSuggestions = async value => {
		
		this.setState({ loading: true })

		// Cancela os requests pendentes
		if (this._token) handler.cancel()

		// Define o token
		this._token = handler.token

		// Url de sugestão
		const url = `/suggestion/${this.props.model}`
		let data = []

		try {

			const resp = await api.suggestion(url, value, this._token._token, this.state.filter)
			data = resp.data

		} finally {
			this.setState({ loading: false, options: data })
		}
	}

	handleSearch = () => {
		const { search, filter } = this.state
		this.props.onSearch({ search, filter })
	}

	handleChange = value => {
		this.setState({ search: value })
	}

	changeFilter = e => {
		this.setState({ filter: e.target.value })
		this.props.onChangeFilter(e.target.value)
	}

	renderToolbar = () => (
		!!this.props.onAddData &&
		<Button type='button' color='primary' className='ml-3' onClick={this.props.onAddData}>
			<i className='fa fa-plus' /> Adicionar {this.props.btnAddText || this.props.model}
		</Button>
	)

	render () {
		const { defaultSearch, defaultFilter } = this.props
		return (
			<form id='search' action={this.props.action}>
				<Row>
					<Col md='auto'>
						<FormGroup>
							<CustomInput type='select' id='filter' name='filter' defaultValue={defaultFilter} onChange={this.changeFilter}>
								{this.props.filters.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
							</CustomInput>
						</FormGroup>
					</Col>
					<Col>
						<AsyncTypeahead
							selectHintOnEnter
							highlightOnlyResult
							minLength={3}
							options={this.state.options}
							onSearch={this.handleSuggestions}
							onChange={val => this.handleChange(val[0])}
							onInputChange={this.handleChange}
							placeholder={this.props.placeholder}
							isLoading={this.state.loading}
							defaultInputValue={defaultSearch}
							promptText='Digite algo para buscar...'
							searchText='Buscando sugestões...'
							emptyLabel='Nenhum registro encontrado.'
						/>
					</Col>
					<Col md='auto'>
						<ButtonToolbar>
							<Button color='primary' onClick={this.handleSearch}>Buscar</Button>
							{ this.renderToolbar() }
						</ButtonToolbar>
					</Col>
				</Row>
			</form>
		)
	}
}

export default Search
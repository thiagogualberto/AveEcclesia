import React, { PureComponent, Fragment } from 'react'
import BootstrapTable from '../BootstrapTable'
import Search from '../Search'

class SearchableTable extends PureComponent {

	constructor (props) {
		super(props)
		this.table = React.createRef()
		this.state = {
			search: '',
			filter: props.filters[0].value,
			...this.search
		}
	}

	get search () {
		const hash = location.hash.replace('#', '')
		if (hash) return JSON.parse(atob(hash))
		else return {}
	}

	handleSearch = query => {
		// location.hash = btoa(JSON.stringify(query))
		this.setState(query)
	}

	refresh = (options = {}) => {
		this.table.current.refresh(options)
	}
	
	bootstrapTable = (method, parameter) => {
		this.table.current.bootstrapTable(method, parameter)
	}

	on = (name, callback) => {
		this.table.current.on(name, callback)
	}

	render () {
		const { model, filters, onAddData, placeholder, ...rest } = this.props
		const { search, filter } = this.state
		return (
			<Fragment>
				<Search
					model={model || rest.url.replace(/^\//, '')}
					filters={filters}
					onAddData={onAddData}
					placeholder={placeholder}
					defaultSearch={search}
					defaultFilter={filter}
					onSearch={this.handleSearch}
					onChangeFilter={this.props.onChangeFilter}
					renderToolbar={this.props.renderToolbar}
				/>
				<BootstrapTable
					{...rest}
					ref={this.table}
					queryParams={params => ({ ...params, search, filter })}
				/>
			</Fragment>
		)
	}
}

export { default as Field } from '../BootstrapTable/Field'
export default SearchableTable
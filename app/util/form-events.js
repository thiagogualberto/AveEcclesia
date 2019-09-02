import React from 'react'

export function withFormEvents(Component) {
	return class extends React.Component {
		
		constructor(props) {
			super(props)
			this.formRef = React.createRef()
			this.tableRef = React.createRef()
			this.state = {
				edit: false,
			}
		}

		// Tagged isOpen`formName`
		isOpen = ([form = '']) => {
			return this.state[`form_${form}`] || false
		}

		// Tagged data`formName`
		data = ([form = '']) => {
			return this.state[`data_${form}`] || {}
		}

		// Tagged initial(data)`formName`
		initial = values => ([form = '']) => ({
			...values,
			...this.state[`data_${form}`] || {}
		})

		// Tagged handleAdd`formName`
		handleAdd = ([form = '']) => {
			return () => this.setState({
				[`data_${form}`]: {},
				[`form_${form}`]: true,
				edit: false
			})
		}

		// Tagged handleEdit`formName`
		handleEdit = ([form = '']) => {
			return (e, val, row) => this.setState({
				[`data_${form}`]: row,
				[`form_${form}`]: true,
				edit: true
			})
		}

		// Tagged handleOpen`formName`
		handleOpen = ([form = '']) => {
			return () => this.setState({
				[`form_${form}`]: true
			})
		}

		// Tagged handleClose`formName`
		handleClose = ([form = '']) => {
			return () => this.setState({
				[`data_${form}`]: {},
				[`form_${form}`]: false,
				edit: false
			})
		}
		
		// Tagged handleSuccess`formName`
		handleSuccess = ([form = '']) => {
			return () => {
				this.setState({ [`data_${form}`]: {}, [`form_${form}`]: false })
				if (this.tableRef.current) {
					this.tableRef.current.refresh()
				}
			}
		}

		// Methods
		refreshTable = () => this.tableRef.current.refresh()

		render = () => (
			<Component
				{...this.props}
				edit={this.state.edit}
				formRef={this.formRef}
				tableRef={this.tableRef}
				refreshTable={this.refreshTable}

				// Tagged props
				data={this.data}
				isOpen={this.isOpen}
				initial={this.initial}
				handleAdd={this.handleAdd}
				handleEdit={this.handleEdit}
				handleOpen={this.handleOpen}
				handleClose={this.handleClose}
				handleSuccess={this.handleSuccess}
			/>
		)
	}
}
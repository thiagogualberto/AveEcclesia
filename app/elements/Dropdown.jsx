import React, { Component } from 'react'

class Dropdown extends Component {

	static defaultProps = {
		items: [],
		format: item => item
	}

	render() {
		return (
			<div className={'dropdown ' + this.props.className}>
				<a className='dropdown-toggle text-dark' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
					{this.props.title}
				</a>
				<div className='dropdown-menu'>
					{
						this.props.items.map((item, index) => (
							<button key={index} className='dropdown-item' type='button' onClick={() => this.props.onSelect(item, index)}>
								{this.props.format(item)}
							</button>
						))
					}
				</div>
			</div>
		);
	}
}

export default Dropdown
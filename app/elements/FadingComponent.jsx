import React, { PureComponent } from 'react'

class FadingComponent extends PureComponent {

	static defaultProps = {
		fade: true
	}

	state = {
		opacity: 0
	}

	render = () => {
		const { fade, ...rest } = this.props
		if (fade) {
			return (
				<div {...rest} style={{ opacity: this.state.opacity, transition: '.3s', ...this.props.style }} />
			)
		} else {
			return this.props.children
		}
	}

	componentDidMount() {
		this.mounted = true
		setTimeout(() => {
			this.mounted && this.setState({ opacity: 1 })
		}, 30);
	}

	componentWillUnmount() {
		this.mounted = false
	}
}

export default FadingComponent
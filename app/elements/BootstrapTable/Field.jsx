import React from 'react'
import PropTypes from 'prop-types'

const Field = props => {
	const { field, align, width, height, events, sortable, formatter, visible, ...rest } = props
	return (
		<th {...rest}
			data-field={field}
			data-align={align}
			data-width={width}
			data-height={height}
			data-events={events}
			data-visible={visible === false ? 'false' : 'true'}
			data-sortable={sortable}
			data-formatter={formatter}
		/>
	)
}

Field.propTypes = {
	sortable: PropTypes.bool
}

export default Field
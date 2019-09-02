import React from 'react'

export default ({ name, size = '1x', color, spin }) => (
	<i className={`fa fa-${name} fa-${size} ${spin && 'fa-spin'}`} style={{color}}/>
)
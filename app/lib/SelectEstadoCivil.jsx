import React from 'react'
import Select from './Select';

export const SelectEstadoCivil = props => (
	<Select {...props} options={estados} />
)

const estados = [
	{ value: 'S', label: 'Solteiro' },
	{ value: 'C', label: 'Casado' },
	{ value: 'D', label: 'Divorciado' },
	{ value: 'V', label: 'Viúvo' },
]

export default SelectEstadoCivil

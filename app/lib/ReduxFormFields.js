import React from 'react'
import FormGroup from './FormGroup'

import _Input from './Input'
import _Select from './Select'
import _InputDate from './InputDate'
import _InputFile from './InputFile'
import _InputMask from './InputMask'
import _InputSexo from './InputSexo'
import _InputBoolean from './InputBoolean'
import _InputCurrency from './InputCurrency'
import _InputTelefone from './InputTelefone'
import _AsyncSelect from './AsyncSelect'
import _AsyncTypehead from './AsyncTypehead'
import _SelectEstados from './SelectEstados'
import _SelectEstadoCivil from './SelectEstadoCivil'

// Default fields
export const Input = withReduxForm(_Input)
export const Select = withReduxForm(_Select)
export const InputDate = withReduxForm(_InputDate)
export const InputFile = withReduxForm(_InputFile)
export const InputMask = withReduxForm(_InputMask)
export const InputBoolean = withReduxForm(_InputBoolean)
export const InputCurrency = withReduxForm(_InputCurrency)
export const InputTelefone = withReduxForm(_InputTelefone)
export const AsyncSelect = withReduxForm(_AsyncSelect)
export const AsyncTypehead = withReduxForm(_AsyncTypehead)

// Custom fields
export const InputSexo = withReduxForm(_InputSexo)
export const SelectEstados = withReduxForm(_SelectEstados)
export const SelectEstadoCivil = withReduxForm(_SelectEstadoCivil)

// HOC to connect with reduxForm
export function withReduxForm(Component) {
	return props => {
		const { input, meta, disabled, ...rest } = props
		return (
			<FormGroup
				{...rest}
				{...input}
				disabled={disabled || meta.autofilled}
				component={Component}
				onChange={e => input.onChange(!!e.target ? e.target.value : '')}
			/>
		)
	}
}
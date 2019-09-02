import React from 'react'
import Action from './Action'

export default ({ _if, ...rest }) => {
  const condition = !!_if ? _if + ' && ' : ''
  return (
    <>
      <Action {...rest} title='Desativar' icon='toggle-on' _if={condition + 'row.ativo'} />
      <Action {...rest} title='Ativar' icon='toggle-off' _if={condition + '!row.ativo'} />
    </>
  )
}
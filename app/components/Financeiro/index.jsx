import React from 'react'
import { Switch } from 'react-router-dom'
import { Route } from '../../util/loadable'

import Movimentacoes from './Movimentacoes/Movimentacoes'
import Contas from './Contas'

export default props => (
  <Switch>
    <Route path='/financeiro/movimentacoes' component={Movimentacoes} />
    <Route path='/financeiro/contas' component={Contas} />
  </Switch>
)

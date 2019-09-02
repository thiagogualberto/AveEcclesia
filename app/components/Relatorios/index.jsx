import React from 'react'
import { Switch, Route } from 'react-router-dom'

import RelatorioMembros from './RelatorioMembros'
import RelatorioAgentes from './RelatorioAgentes'
import RelatorioDizimos from './RelatorioDizimos'
import RelatorioParoquias from './RelatorioParoquias'
import RelatorioFinanceiro from './RelatorioFinanceiro'

export default props => (
  <Switch>
    <Route path='/relatorios/finance' component={RelatorioFinanceiro} />
    <Route path='/relatorios/membros' component={RelatorioMembros} />
    <Route path='/relatorios/agentes' component={RelatorioAgentes} />
    <Route path='/relatorios/devolucao' component={RelatorioDizimos} />
    <Route path='/relatorios/paroquias' component={RelatorioParoquias} />
  </Switch>
)
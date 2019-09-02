import React from 'react'
import { Switch } from 'react-router-dom'
import { Route } from '../../util/loadable'

import Batismos from './Batismos'
import Crismas from './Crismas'
import Matrimonios from './Matrimonios'

export default props => (
  <Switch>
    <Route path='/sacramentos/batismo' component={Batismos} />
    <Route path='/sacramentos/crisma' component={Crismas} />
    <Route path='/sacramentos/matrimonio' component={Matrimonios} />
  </Switch>
)

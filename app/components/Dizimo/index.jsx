import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Dizimistas from './Dizimistas'
import Dizimos from './Dizimos'

export default props => (
  <Switch>
    <Route path='/dizimo/dizimistas' component={Dizimistas} />
    <Route path='/dizimo/dizimos' component={Dizimos} />
  </Switch>
)

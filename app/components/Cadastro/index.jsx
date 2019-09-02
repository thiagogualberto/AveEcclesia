import React from 'react'
import { Switch, Route } from 'react-router-dom'

import MembroDetalhes from './MembroDetalhes'
import Membros from './Membros'
import Agentes from './Agentes'
import Comunidades from './Comunidades'
import PrestadoresServico from './PrestadoresServico'
import Funcionarios from './Funcionarios'
import Usuarios from './Usuarios'
import Paroquias from './Paroquias'

export default props => (
  <Switch>
    <Route path='/cadastro/membros/:id/:form?' component={MembroDetalhes} />
    <Route path='/cadastro/membros' component={Membros} />
    <Route path='/cadastro/agentes' component={Agentes} />
    <Route path='/cadastro/comunidades' component={Comunidades} />
    <Route path='/cadastro/prestadores' component={PrestadoresServico} />
    <Route path='/cadastro/funcionarios' component={Funcionarios} />
    <Route path='/cadastro/usuarios' component={Usuarios} />
    <Route path='/cadastro/paroquias' component={Paroquias} />
  </Switch>
)

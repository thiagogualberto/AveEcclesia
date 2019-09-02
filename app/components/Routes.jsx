import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { Route } from '../util/loadable'

export default () => (
  <Switch>
    <Redirect exact from='/' to='/paroquia' />
    <Route path='/paroquia' loader={() => import('./HomeParoquia' /* webpackChunkName: "home" */)} />
    <Route path='/cadastro' loader={() => import('./Cadastro' /* webpackChunkName: "cadastros" */)}  />
    <Route path='/sacramentos' loader={() => import('./Sacramentos' /* webpackChunkName: "sacramentos" */)} />
    <Route path='/dizimo' loader={() => import('./Dizimo' /* webpackChunkName: "dizimo" */)} />
    <Route path='/financeiro' loader={() => import('./Financeiro' /* webpackChunkName: "financeiro" */)} />
    <Route path='/relatorios' loader={() => import('./Relatorios' /* webpackChunkName: "relatorios" */)} />
    <Route path='/perfil' loader={() => import('./Perfil' /* webpackChunkName: "settings" */)} />
    <Route loader={() => import('./Error404' /* webpackChunkName: "erros" */)} />
  </Switch>
)
import React, { Component, PureComponent } from 'react'
import { Row, Table } from 'reactstrap'
import { components } from 'react-select'

import api from '../../../api'
import date from '../../../util/date'
import Field from '../../../elements/Field'
import { FormModal } from '../../../elements/FormModal'
import { Tab, Tabs, TabCard, TabPane } from '../../../elements/Tabs'
import { SelectOptionTitle } from './styles'

const options = [
	{ value: 1, label: 'Sim' },
	{ value: 0, label: 'Não' }
]

const escolaridade = [
	{ value: 'F', label: 'Ensino Fundamental' },
	{ value: 'M', label: 'Ensino Médio' },
	{ value: 'S', label: 'Ensino Superior' },
	{ value: 'E', label: 'Mestrado' },
	{ value: 'D', label: 'Doutorado' }
]

const regime = [
	{ value: 'U', label: 'Comunhão Universal de Bens' },
	{ value: 'P', label: 'Comunhão Parcial de Bens' },
	{ value: 'S', label: 'Separação de Bens' }
]

const sim_nao = [
	{ value: 'sim', label: 'Sim' },
	{ value: 'não', label: 'Não' }
]

const sacramentos = [
	{ value: 1, label: 'Batismo' },
	{ value: 2, label: '1ª Comunhão' },
	{ value: 3, label: 'Crisma' },
]

const defaultState = {
	id: null,
	noivo_id: [],
	noiva_id: [],
	noivo_nome: '',
	noiva_nome: '',
	dt_curso: '',
	dt_registro: '',
	dt_casamento: '',
	hr_casamento: '',
	local_curso: '',
	local_casamento: user.paroquia.nome,
	proclamas1: '',
	proclamas2: '',
	proclamas3: '',
	cartorio: '',
	regime_bens: '',
	num_certidao: '',
	menor: '0',
	autorizacao: '1',
	q1a: '', q1b: '',
	q2a: '', q2b: '',
	q3a: '', q3b: '',
	q4a: '', q4b: '',
	q5a: 'sim', q5b: 'sim',
	q6a: 'sim', q6b: 'sim',
	q7a: 'sim', q7b: 'sim',
	q8a: 'não', q8b: 'não',
	q9a: '-', q9b: '-',
	q10a: 'não', q10b: 'não',
	q11a: '-', q11b: '-',
	q12a: '-', q12b: '-',
	q13a: '', q13b: '',
	q14a: 'sim', q14b: 'sim',
	edit: false,
	saving: false,
	activeTab: '1'
}

const formatMembro = props => ({
	...props,
	label: props.nome,
	value: props.pessoa_id,
})

const Option = ({ data: { nome, mae, dt_nascimento }, ...rest }) => (
	<components.Option {...rest}>
		<SelectOptionTitle>{nome}</SelectOptionTitle>
		<small className='text-muted'>
			<div><strong>Mãe: </strong> {mae}</div>
			<div><strong>Dt.Nasc: </strong> {date.unserialize(dt_nascimento)}</div>
		</small>
	</components.Option>
)

class FormMatrimonio extends Component {

	static defaultProps = {
		onFormChange: () => { },
		onSubmitError: () => { },
		onSubmitSuccess: () => { },
	}

	constructor(props) {
		super(props)
		this.form = React.createRef()
		this.state = defaultState
		window.editMatrimonio = this.editData
		window.addMatrimonio = this.addData
	}

	get data() {
		const { edit, activeTab, error, saving, noivo_pai, noiva_pai, noivo_mae, noiva_mae, ...data } = this.state
		return {
			...data,
			noivo_id: data.noivo_id.value,
			noiva_id: data.noiva_id.value,
			regime_bens: data.regime_bens || null,
			dt_casamento: !!data.dt_casamento ? date.serialize(data.dt_casamento) : null
		}
	}

	handleChange = ({ target }) => {
		this.setState({
			[target.name]: target.value
		});
	}

	handleSelect = ({ target }, item) => {
		this.setState({
			[target.name]: item,
			[target.name.replace('id', 'nome')]: item.label
		});
	}

	handleSubmit = (e) => {

		e.preventDefault()
		e.stopPropagation()

		const req = this.state.edit ?
			api.editData('matrimonio', this.data) :
			api.postData('matrimonio', this.data)

		req.then(({ data }) => {

			// Se tiver sucesso
			if (data.success) {

				this.props.onSubmitSuccess(data.data)
				this.addData()

				// Fecha o modal
				this.form.current.closeModal()

			} else { // Senão mostra o erro
				this.props.onSubmitError(data.message)
				this.setState({
					error: data.message,
					saving: false
				})
			}
		})

		this.setState({
			error: undefined,
			saving: true
		})
	}

	editData = data => {
		this.form.current.openModal()
		this.setState({
			...data,
			edit: true,
			error: false,
			saving: false,
			activeTab: '1'
		})
	}

	addData = data => {
		this.form.current.openModal()
		this.setState({ ...defaultState, ...data })
	}

	tabChange = index => {
		this.setState({ activeTab: index })
	}

	render() {
		return (
			<FormModal
				ref={this.form}
				row={false}
				onSubmit={this.handleSubmit}
				data={this.data}
				error={this.state.error}
				saving={this.state.saving}
				name='matrimonio'
				size='lg'
				method='post'>
				<Tabs onChange={this.tabChange} activeTab={this.state.activeTab}>
					<Tab>Dados do casamento</Tab>
					<Tab>Casamento Civil</Tab>
					<Tab>Autorização dos pais</Tab>
					<Tab>Declaração dos noivos</Tab>
				</Tabs>
				<TabCard activeTab={this.state.activeTab}>
					<TabPane>
						<Row>
							<Campo
								md={6}
								_if={!this.state.edit}
								type='select'
								model='matrimonio/membros?sexo=M'
								label='Noivo'
								name='noivo_id'
								placeholder='Selecione um membro...'
								value={this.state.noivo_id}
								components={{ Option }}
								format={formatMembro}
								onChange={this.handleSelect}
								disabled={this.state.edit}
								required
							/>
							<Campo
								md={6}
								_if={!this.state.edit}
								type='select'
								model='matrimonio/membros?sexo=F'
								label='Noiva'
								name='noiva_id'
								placeholder='Selecione um membro...'
								value={this.state.noiva_id}
								components={{ Option }}
								format={formatMembro}
								onChange={this.handleSelect}
								disabled={this.state.edit}
								required
							/>
							{/* <Campo type='static' label='Noivo' value={this.state.nome} _if={this.state.edit} />
							<Campo type='static' label='Noiva' value={this.state.nome} _if={this.state.edit} /> */}
							<Campo md={6} label='Nome de casamento (noivo)' name='noivo_nome' value={this.state.noivo_nome} onChange={this.handleChange} required />
							<Campo md={6} label='Nome de casamento (noiva)' name='noiva_nome' value={this.state.noiva_nome} onChange={this.handleChange} required />
							<Campo md={3} label='Data do casamento' name='dt_casamento' type='date' value={this.state.dt_casamento} onChange={this.handleChange} required />
							<Campo md={3} label='Hora do casamento' name='hr_casamento' type='time' value={this.state.hr_casamento} onChange={this.handleChange} required />
							<Campo md={6} label='Local do casamento' name='local_casamento' value={this.state.local_casamento} onChange={this.handleChange} required />
						</Row>
						<hr />
						<h4 style={{ marginBottom: 25 }}>Proclamas</h4>
						<Row>
							<Campo md={4} label='Proclamas 1' name='proclamas1' type='date' value={this.state.proclamas1} onChange={this.handleChange} />
							<Campo md={4} label='Proclamas 2' name='proclamas2' type='date' value={this.state.proclamas2} onChange={this.handleChange} />
							<Campo md={4} label='Proclamas 3' name='proclamas3' type='date' value={this.state.proclamas3} onChange={this.handleChange} />
						</Row>
						<hr />
						<h4 style={{ marginBottom: 25 }}>Curso de noivos</h4>
						<Row>
							<Campo md={6} label='Data do curso' name='dt_curso' type='date' value={this.state.dt_curso} onChange={this.handleChange} />
							<Campo md={6} label='Local do curso' name='local_curso' value={this.state.local_curso} onChange={this.handleChange} />
						</Row>
					</TabPane>
					<TabPane>
						<Row>
							<Campo md={6} label='Cartório civil' name='cartorio' value={this.state.cartorio} onChange={this.handleChange} />
							<Campo md={6} label='Data do registro' name='dt_registro' type='date' value={this.state.dt_registro} onChange={this.handleChange} />
							<Campo md={6} label='Regime de bens' name='regime_bens' type='select' simple options={regime} value={this.state.regime_bens} onChange={this.handleChange} />
							<Campo md={6} label='Nº da Certidão de Habilitação' name='num_certidao' value={this.state.num_certidao} onChange={this.handleChange} />
						</Row>
					</TabPane>
					<TabPane>
						<Row>
							<Campo md={6} type='radio' name='menor' label='Os nubentes são menores?' onChange={this.handleChange} value={this.state.menor} options={options} inline required />
							<Campo md={6} type='radio' name='autorizacao' label='Os pais autorizam o casamento?' onChange={this.handleChange} value={this.state.autorizacao} options={options} inline required />
						</Row>
					</TabPane>
					<TabPane>
						<Table>
							<thead>
								<tr>
									<th width="50%">Questões</th>
									<th>Noivo</th>
									<th>Noiva</th>
								</tr>
							</thead>
							<TBody onChange={this.handleChange}>
								<Tr>
									<TableLabel>Sua religião:</TableLabel>
									<TableCampo name='q1a' value={this.state.q1a} />
									<TableCampo name='q1b' value={this.state.q1b} />
								</Tr>
								<Tr>
									<TableLabel>Sacramentos:</TableLabel>
									<TableCampo name='q2a' type='checkbox-multi' options={sacramentos} value={this.state.q2a} />
									<TableCampo name='q2b' type='checkbox-multi' options={sacramentos} value={this.state.q2b} />
								</Tr>
								<Tr>
									<TableLabel>Sua profissão:</TableLabel>
									<TableCampo name='q3a' value={this.state.q3a} />
									<TableCampo name='q3b' value={this.state.q3b} />
								</Tr>
								<Tr>
									<TableLabel>Escolaridade:</TableLabel>
									<TableCampo name='q4a' type='select' options={escolaridade} value={this.state.q4a} />
									<TableCampo name='q4b' type='select' options={escolaridade} value={this.state.q4b} />
								</Tr>
								<Tr>
									<TableLabel>Vai se casar livre e espontaneamente?</TableLabel>
									<TableCampo name='q5a' type='select' options={sim_nao} value={this.state.q5a} />
									<TableCampo name='q5b' type='select' options={sim_nao} value={this.state.q5b} />
								</Tr>
								<Tr>
									<TableLabel>Vai assumir o matrimônio por toda vida?</TableLabel>
									<TableCampo name='q6a' type='select' options={sim_nao} value={this.state.q6a} />
									<TableCampo name='q6b' type='select' options={sim_nao} value={this.state.q6b} />
								</Tr>
								<Tr>
									<TableLabel>Compromete-se a acolher e educar cristãmente seus filhos?</TableLabel>
									<TableCampo name='q7a' type='select' options={sim_nao} value={this.state.q7a} />
									<TableCampo name='q7b' type='select' options={sim_nao} value={this.state.q7b} />
								</Tr>
								<Tr>
									<TableLabel>Já se casou no Civil?</TableLabel>
									<TableCampo name='q8a' type='select' options={sim_nao} value={this.state.q8a} />
									<TableCampo name='q8b' type='select' options={sim_nao} value={this.state.q8b} />
								</Tr>
								<Tr>
									<TableLabel>Com quem?</TableLabel>
									<TableCampo name='q9a' value={this.state.q9a} disabled={this.state.q8a == 'não'} />
									<TableCampo name='q9b' value={this.state.q9b} disabled={this.state.q8b == 'não'} />
								</Tr>
								<Tr>
									<TableLabel>Já se casou no Religioso?</TableLabel>
									<TableCampo name='q10a' type='select' options={sim_nao} value={this.state.q10a} />
									<TableCampo name='q10b' type='select' options={sim_nao} value={this.state.q10b} />
								</Tr>
								<Tr>
									<TableLabel>Com quem?</TableLabel>
									<TableCampo name='q11a' value={this.state.q11a} disabled={this.state.q10a == 'não'} />
									<TableCampo name='q11b' value={this.state.q11b} disabled={this.state.q10b == 'não'} />
								</Tr>
								<Tr>
									<TableLabel>Como se desfez o referido casamento?</TableLabel>
									<TableCampo name='q12a' value={this.state.q12a} disabled={this.state.q10a == 'não'} />
									<TableCampo name='q12b' value={this.state.q12b} disabled={this.state.q10b == 'não'} />
								</Tr>
								<Tr>
									<TableLabel>Há algum parentesco entre vocês? Qual?</TableLabel>
									<TableCampo name='q13a' value={this.state.q13a} />
									<TableCampo name='q13b' value={this.state.q13b} />
								</Tr>
								<Tr>
									<TableLabel>Fez o curso de noivos?</TableLabel>
									<TableCampo name='q14a' type='select' options={sim_nao} value={this.state.q14a} />
									<TableCampo name='q14b' type='select' options={sim_nao} value={this.state.q14b} />
								</Tr>
							</TBody>
						</Table>
					</TabPane>
				</TabCard>
			</FormModal>
		)
	}
}

function formatProps(children, format) {
	return React.Children.map(
		children,
		(child, index) => React.cloneElement(child, format(child, index))
	)
}

const TBody = ({ children, onChange }) => <tbody>{formatProps(children, (child, index) => ({ index, onChange }))}</tbody>
const Tr = ({ index, onChange, children }) => <tr>{formatProps(children, () => ({ index, onChange }))}</tr>
const TableLabel = props => <td><strong>{props.index + 1})</strong> {props.children}</td>
const TableCampo = props => <td><Campo {...props} onChange={props.onChange} simple size='sm' group={false} /></td>

class Campo extends PureComponent {

	static defaultProps = {
		md: 12
	}

	col_to_class(col, num) {
		return `col-${col}-${num}`
	}

	get col() {
		return ' ' + this.col_to_class('md', this.props.md)
	}

	render() {
		const { md, ...props } = this.props
		return (
			<Field
				{...props}
				className={this.col}
			/>
		)
	}
}

export default FormMatrimonio

import React from 'react'
import { connect } from 'react-redux'
import { Route } from '../../../util/loadable'

export function withRouteAndProps(Component, key, mapDispatchToProps)
{
	const mapStateToProps = ({ detalhes }) => {
		return {
			edit: detalhes.edit,
			membro: detalhes.membro,
			initialValues: detalhes[key],
			filled: detalhes.membro[`ie_${key}`],
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(
		class extends React.PureComponent {
			render() {
				const {path, exact, ...allProps} = this.props
				return (
					<Route exact={exact} path={path}>
						{ props => <Component {...allProps} pessoa_id={props.match.params.id} /> }
					</Route>
				)
			}
		}
	)
}

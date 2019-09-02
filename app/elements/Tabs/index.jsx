import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavLink, NavItem, TabPane as RTabPane } from 'reactstrap'
import { TabContentCard } from './styles'

export const TabPane = RTabPane

export const Tabs = props => (
	<Nav tabs>
		{
			React.Children.map(
				props.children,
				(child, index) => React.cloneElement(child, {
					active: props.activeTab == `${index + 1}`,
					onClick: () => props.onChange(`${index + 1}`)
				})
			)
		}
	</Nav>
)

Tabs.defaultProps = {
	onChange: ()=>{}
}

export const Tab = props => (
	<NavItem>
		<NavLink
			{...props}
			className='no-smoothState'
			href={!props.href ? '#' : undefined}
			to={!!props.href ? props.href : undefined}
			tag={!!props.href ? Link : undefined}
			active={props.active}>
			{props.children}
		</NavLink>
	</NavItem>
)

export const TabCard = props => (
	<TabContentCard {...props} className='card'>
		{
			React.Children.map(
				props.children,
				(child, index) => {
					if (child.type == RTabPane) {
						return React.cloneElement(child, { tabId: `${index + 1}` })
					} else {
						return <RTabPane tabId={`${index + 1}`}>{child}</RTabPane>
					}
				}
			)
		}
	</TabContentCard>
)

export { TabContentCard }

TabCard.defaultProps = {
	activeTab: '1'
}
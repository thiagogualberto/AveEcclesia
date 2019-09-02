import React from 'react'
import { Link } from 'react-router-dom'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export default () => (
	<UncontrolledDropdown nav inNavbar>
		<DropdownToggle nav caret>
			<i className='fa fa-bell' />
		</DropdownToggle>
		<DropdownMenu style={{ minWidth: '26rem'}} right>
			<DropdownItem tag='h5'>Notificações</DropdownItem>
			<DropdownItem divider />
			<div style={{ overflowY: 'scroll', height: 270}}>
				<ul className='list-group list-group-flush' id='notifications'></ul>
			</div>
			<DropdownItem divider />
			<DropdownItem tag='button' className='text-center' onClick={removeNotification}>
				<span className='fa fa-times' /> Limpar tudo
			</DropdownItem>
		</DropdownMenu>
	</UncontrolledDropdown>
)

var $ntf_badge = $('#notification-badge')
var $ntf_container = $('#notifications')
var notifications = !!localStorage.notifications ? JSON.parse(localStorage.notifications) : []

function add_notification(type, text) {

	// Adiciona a notificação
	notifications.push({type: type, message: text})
	localStorage.notifications = JSON.stringify(notifications)
	$ntf_container.append(render_notification({type: type, message: text}, notifications.length - 1))

	// Seta o badge
	$ntf_badge.text(notifications.length)
	$ntf_badge.show()
}

function removeNotification(e, elem)
{
	e.stopPropagation()

	// Remove 1, ou todos caso não haja botao de origem
	if (elem) {
		var $li = $(elem).parent()
		notifications.splice($li.index(), 1)
		$li.remove()
	} else {
		$ntf_container.html('')
		notifications = []
	}

	// Oculta o badge caso não haja notificação
	if (notifications.length == 0) {
		$ntf_badge.hide()
	}

	localStorage.notifications = JSON.stringify(notifications)
	$ntf_badge.text(notifications.length)
}

function renderNotification({type, message}, index) {
	return (
		<li className="list-group-item d-flex justify-content-between align-items-center notification notification-${type}">
			<span className="message">
				{message}<br/>
				<small className="text-muted">
					{new Date().toLocaleString()}
				</small>
			</span>
			<button className="btn badge badge-danger badge-pill" style="display:none" onClick={e => removeNotification(e, this)}>X</button>
		</li>
	)
}

if (!!notifications.length) {
	$ntf_badge.text(notifications.length)
	$ntf_badge.show()
}

notifications.forEach((ntf, index) => {
	$ntf_container.append($ntf_container.append(render_notification(ntf, index)))
});
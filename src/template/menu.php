<ul class="navbar-nav ml-md-auto">
	<li class="nav-item dropdown d-none d-md-block">
		<a class="nav-link dropdown-toggle" href="#" id="navNotificacoes" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			<i class="fa fa-bell"></i><span class="badge badge-danger badge-pill" id="notification-badge" style="position:absolute;top:-3px;left:18px;display:none">0</span>
		</a>
		<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navNotificacoes" style="min-width: 26rem;">
			<h5 class="dropdown-item">Notificações</h5>
			<div class="dropdown-divider"></div>
			<div style="overflow-y:scroll;height:270px">
				<ul class="list-group list-group-flush" id="notifications"></ul>
			</div>
			<div class="dropdown-divider"></div>
			<button class="dropdown-item text-center" onclick="remove_notification(event)"><span class="fa fa-times"></span> Limpar tudo</button>
		</div>
	</li>
	<li class="nav-item dropdown">
		<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			<i class="fa fa-user"></i> <?= $req->user->paroquia->nome ?? $req->user->nome ?>
		</a>
		<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
			<a class="dropdown-item" href="<?php $res->url('/perfil') ?>"><i class="fa fa-user"></i> Perfil</a>
			<a class="dropdown-item" href="<?php $res->url('/settings') ?>"><i class="fa fa-gear"></i> Configurações</a>
			<div class="dropdown-divider"></div>
			<a class="dropdown-item" href="<?php $res->url('/auth/logout') ?>"><i class="fa fa-sign-out"></i> Sair</a>
		</div>
	</li>
</ul>
<style>
.notification .message::before {
    content: "";
	border-radius: 50%;
	padding: 6px;
	margin-right: 10px;
	font-size: 0px;
	position: relative;
	top: -6px;
}

.notification:hover > .btn {
	display: block!important
}

.notification-success .message::before { background: #28a745 }
.notification-danger .message::before { background: #dc3545 }
</style>
<script>
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

	function remove_notification(e, elem)
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

	function render_notification({type, message}, index) {
		return `<li class="list-group-item d-flex justify-content-between align-items-center notification notification-${type}"><span class="message">${message}<br><small class="text-muted">${new Date().toLocaleString()}</small></span><button class="btn badge badge-danger badge-pill" style="display:none" onclick="remove_notification(event, this)">X</button></li>`
	}

	if (!!notifications.length) {
		$ntf_badge.text(notifications.length)
		$ntf_badge.show()
	}

	notifications.forEach((ntf, index) => {
		$ntf_container.append($ntf_container.append(render_notification(ntf, index)))
	});
</script>
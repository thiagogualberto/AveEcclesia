/**
 * Funções relacionadas à sidebar
 * @author Carlos Roberto
 */
function mount_sidebar() {
	$('.sidebar > .nav > .nav-item > .nav-link').click(function() {
		$('.collapse.show').collapse('hide')
	})
}

mount.add(mount_sidebar)

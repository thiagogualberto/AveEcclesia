mount.add(function() {
	$('input[data-type="date"]').each(function (e, elem) {
		$(elem)
			.mask('99/99/9999')
			.attr('pattern', '\\d{2}/((0\\d)|(1[0-2]))/\\d{4}')
			.datepicker({
				locale: 'pt-br',
				format: 'dd/mm/yyyy',
				uiLibrary: 'bootstrap4'
			})
	})
	$('input[data-type="time"]').each(function (e, elem) {
		$(elem).mask('99:99').timepicker({
			locale: 'pt-br',
			uiLibrary: 'bootstrap4',
			modal: false,
			mode: '24hr',
			footer: false
		})
	})
	$('input[data-type="datetime"]').each(function (e, elem) {
		$(elem).mask('99/99/9999 99:99').datetimepicker({
			locale: 'pt-br',
			format: 'dd/mm/yyyy HH:MM',
			uiLibrary: 'bootstrap4'
		})
	})
	$('input[type=tel]').mask('(99) 9999-9999?9').focusout(function (event) {
		var target, phone, element;
		target = (event.currentTarget) ? event.currentTarget : event.srcElement;
		phone = target.value.replace(/\D/g, '');
		element = $(target);
		element.unmask();
		if (phone.length > 10) {
			element.mask('(99) 99999-999?9');
		} else {
			element.mask('(99) 9999-9999?9');
		}
	});
	$('[type=brl]').on('input', function (event) {

		event.preventDefault()
		event.stopPropagation()

		var $elem = $(event.target)
		var value = $elem.val()
		
		// Insere o valor no campo
		$elem.val(format_brl(value))
	})
})

function format_brl(value) {

	if (typeof value === 'number') {
		value = value.toFixed(2)
	}

	// Remove a vírgula e zeros a esquerda
	value = value.replace(/\D/g, '').replace(/^0*([1-9][0-9]*)/, '$1')

	// Formata para o formato brl
	if (value.length == 1) {
		value = '0,0' + value
	} else if (value.length == 2) {
		value = '0,' + value
	} else {
		value = value.replace(/(\d*)(\d{2})/, '$1,$2').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
	}

	return 'R$ ' + value
}

mount.add(function () {
	$('input[mask]').each(function () {
		var $elem = $(this)
		$elem.mask($elem.attr('mask'))
	})
})
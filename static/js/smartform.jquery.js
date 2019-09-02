/**
 * SMART FORM JQUERY
 * 
 * @license MIT
 * @author Carlos Roberto
 * @version 0.0.1
 */
(function ($) {

	$.fn.toObject = function (elem) {

		const $disabled = this.find(':input:disabled').removeAttr('disabled');
		const array = this.serializeArray()
		const obj = {}

		$disabled.attr('disabled', true)

		for (let key in array) {

			let { name, value } = array[key]

			if (value === '') {
				continue
			} else if (value === 'true') {
				value = true
			} else if (value === 'false') {
				value = false
			} else if (/(\d{2})\/(\d{2})\/(\d{4})/.test(value)) {
				value = value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
			}

			if (~name.indexOf('.')) {
				const [key1, key2] = name.split('.')
				obj[key1] = { ...obj[key1], [key2]: value }
			} else {
				obj[name] = value
			}
		}

		// Modificar o objeto após serializar
		this.trigger('serialize', obj)

		return obj
	}

	function string2obj(key, value) {
		if (~key.indexOf('.')) {
			const result = key.match(/(\w+).(.*)/)
			return { [result[1]]: string2obj(result[2], value)}
		}
		return {[key]: value}
	}

	$.fn.fromObject = function (data, reset = true) {

		const form = this
		let obj = Object.assign({}, data)

		// Modificar o objeto antes de colocar no form
		this.trigger('unserialize', obj)

		if (reset) {
			this.trigger('reset')
		}

		// Nested objects
		for (let key in obj) {
			if (typeof obj[key] === 'object') {
				for (let nested_key in obj[key]) {
					obj[key + '.' + nested_key] = obj[key][nested_key]
				}
				delete obj[key]
			}
		}

		$.each(obj, function (key, value) {
			var ctrl = $('[name="' + key + '"]', form);
			switch (ctrl.prop('type')) {
				case 'radio':
				case 'checkbox':
					ctrl.each(function () {
						if (this.value == value) this.checked = true
					});
					break;
				default: ctrl.value(value);
			}
			ctrl.trigger('change')
		});
	}

	$.fn.clear = function (hidden = true) {

		this.find(':checkbox, :radio').prop('checked', false);

		if (hidden) {
			this.find(':input').not(':button, :submit, :reset, :radio').val('');
		} else {
			this.find(':input').not(':button, :submit, :radio, :hidden, :reset').val('');
		}

		return this
	}

	$.fn.smartform = function (method = 'post', path) {

		// Remove todos eventos de click
		this.unbind('submit')

		// Caso não tenha sido rodado ainda
		if (this.data('original-url') == undefined) {
			this.data('original-url', this.prop('action'))
		}

		var originalUrl = this.data('original-url')
		var $submit_btn = $('[type=submit]', this)
		
		// Acrescenta o path se for PUT method
		if (method == 'put') {
			this.prop('action', originalUrl + '/' + path)
		} else {
			this.prop('action', originalUrl)
		}
		
		this.prop('method', method)
		this.on('submit', e => {

			// Cancela eventos posteriores
			e.preventDefault()
			e.stopPropagation()
			
			// Desabilita o botão pra evitar envio repetido
			$submit_btn.prop('disabled', true)

			try {

				var data = this.toObject()
				this.trigger('pre:submit', data)
	
				$.ajax({
					method: method,
					url: this.prop('action'),
					data: JSON.stringify(data),
					contentType: 'application/json',
					dataType: 'json',
					success: resp => this.trigger('pos:submit', resp),
					complete: resp => $submit_btn.prop('disabled', false)
				})

			} catch (e) {
			}
		})

		return this
	}

	// Retorna o valor recursivo
	function get_key(array, name) {
		let part = array
		try {
			name.split('.').forEach(key => {
				part = part[key]
			})
		} catch (error) {
			return undefined
		}
		return part
	}

})(jQuery)

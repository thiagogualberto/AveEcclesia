(function ($) {

	$.fn.dateFormat = function () {
		const regexp = /\d{4}-\d{2}-\d{2}/
		return this.each(function() {
			if (regexp.test(this.innerHTML)) {
				if (this.innerHTML == '0000-00-00') {
					this.innerHTML = '-'
				} else {
					// const date = getFormattedDate(new Date(this.innerHTML))
					const date = this.innerHTML.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$3/$2/$1')
					this.innerHTML = date
				}
			}
		});
	}

	$.fn.value = function (value) {

		if (value !== undefined) {

			if (!!value && this.data('type') == 'datepicker') {
				value = value.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$3/$2/$1')
			}

			return this.val(value)
		}

		value = this.val();

		if (this.data('type') == 'date') {
			return value.replace(/(\d{2})\/(\d{2})\/(\d{4}).*/, '$3-$2-$1')
		}

		return value
	}

	function getFormattedDate(date) {
		var year = date.getFullYear();

		var month = (1 + date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;

		var day = (1+ date.getDate()).toString();
		day = day.length > 1 ? day : '0' + day;

		return day + '/' + month + '/' + year;
	}

})(jQuery)

var $search = $('form#search')

function search(e, form) {

	e.preventDefault()
	e.stopPropagation()

	var obj = $(form).toObject()
	location.hash = btoa(JSON.stringify(obj))
}

function mount_search () {

	$search = $('form#search')
	if (!$search.length) return;

	var dizimistas = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: $search.prop('action').replace('/api', '/api/suggestion'),
			prepare: function (query, settings) {
				settings.url += '?'+$search.serialize()
				return settings
			}
		}
	});

	$('#busca').typeahead({
		minLength: 3,
		highlight: true
	}, {
		limit: 8,
		source: dizimistas
	});

	!!location.hash && table_search()
	$(window).on('hashchange', table_search)
}

function table_search() {

	var hash = location.hash.replace('#', '')
	var json = {}

	if (hash) {
		json = JSON.parse(atob(hash))
	}

	$('#search').fromObject(json)
	$('.table').bootstrapTable('refresh', {
		url: $search.prop('action') + '?' + $.param(json),
	})
}

mount.add(mount_search)

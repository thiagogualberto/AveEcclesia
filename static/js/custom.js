window.mount = {}

mount._callbacks = []
mount._queue = []
mount._loaded = false

mount.execAll = function () {

	// Executa os scripts de montagem
	this._callbacks.forEach(func => func.call());

	// Executa e limpa a fila
	for (let i = 0; i < this._queue.length; i++) {
		var func = this._queue.shift()
		func.call();
	}

	this.loaded = true
}

mount.exists = function (func) {
	return ~this._callbacks.indexOf(func)
}

mount.add = function (func) {
	if (!this.exists(func)) {
		this._callbacks.push(func)
	}
}

mount.enqueue = function (func) {
	
	if (this._loaded) {
		func.call()
	} else {
		this._queue.push(func)
	}
}

mount.loadScript = function(url, callback) {

	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState) {  //IE
		script.onreadystatechange = function () {
			if (script.readyState == "loaded" ||
				script.readyState == "complete") {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {  //Others
		script.onload = function () {
			callback();
		};
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

$(document).ready(mount.execAll.bind(mount))

// Desativa o campo não usado
function set_field(name, value, enable = false) {
	var $elem = $('[name=' + name + ']')
	$elem.val(value)

	if (value == '' || enable) {
		$elem.prop('disabled', false);
	} else {
		$elem.prop('disabled', true);
	}

	return $elem
}
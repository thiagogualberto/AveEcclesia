<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="shortcut icon" href="">
	<link rel="manifest" href="<?php $res->url('/config/manifest.json') ?>">
	<link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
	<link rel="stylesheet" href="//stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.13.1/bootstrap-table.min.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.min.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/gijgo/1.9.6/combined/css/gijgo.min.css">

	<?php
	$res->css('/css/dashboard.css');
	$res->css('/css/sticky-footer.css');
	$res->css('/css/custom.css');
	?>

	<script src="//code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
	<?php $res->script('/js/custom.js') ?>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js"></script>

	<title>Ave Ecclesia</title>
</head>
<body>
	<header id='header'></header>
	<div class="container-fluid">
		<div class="row">
			<script>
				// A url de montagem do framework
				window.mounturl = '<?=$req->app->mounturl?>'
				// Objeto do usuário atual
				window.user = <?= json_encode($req->user) ?>
			</script>
			<nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar" id='sidebar'></nav>
			<main role="main" id="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3"></main>
		</div>
	</div>
	<footer class="footer d-flex flex-row-reverse">
		<div class="col-sm-9 ml-sm-auto col-md-10">
			<div class="row">
				<div class="container-fluid">
					<span class="text-muted">Vertex Group Technology - Todos direitos reservados.</span>
				</div>
			</div>
		</div>
	</footer>
	<div id='loading'></div>
	<div id='initialLoad' class='position-fixed d-flex flex-column align-items-center justify-content-center bg-white fade show' style="top:0;bottom:0;left:0;right:0;z-index:99999">
		<img src="<?= $req->app->mounturl . '/img/icone.png' ?>" style="width: 250px">
		<div class="spinner-border text-secondary mt-3" role="status">
			<span class="sr-only">Carregando conteúdo...</span>
		</div>
	</div>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.0.1/jquery-migrate.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
	<script src="//stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.13.1/bootstrap-table.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.13.1/locale/bootstrap-table-pt-BR.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/gijgo/1.9.10/combined/js/gijgo.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/gijgo/1.9.10/combined/js/messages/messages.pt-br.min.js"></script>
	<?php
		// React script path
		$react = str_replace('static', '', glob('static/js/bundle/main.*.js')[0]);
		// Scripts
		$res->script($react);
	?>
</body>
</html>

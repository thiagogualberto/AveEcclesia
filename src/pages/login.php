<?php
include 'lib/forms.php';
include 'lib/alerts.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">

	<link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
	<link rel="stylesheet" href="//stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
	<link rel="stylesheet" href="css/sticky-footer.css">
	<link rel="stylesheet" href="css/custom.css">

	<script src="//code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
	<script src='https://www.google.com/recaptcha/api.js'></script>

	<title>Ave Ecclesia - Login</title>
</head>
<body class="bg-color">
	<script type="text/javascript">
		function do_login () {
			$('#login').submit();
			// $.post('', $('#login').serialize())
		}

		function on_click_login() {
			const elem = event.target
			elem.innerHTML = 'Entrando <i class="fa fa-spin fa-spinner"></i>'
			elem.disabled = true
		}
	</script>
	<div class="container bg-color" style="margin-top:10%">
		<div class="col-lg-4 col-md-6 mx-auto" style="text-align:center;margin-bottom:35px;">
			<img src="<?= $req->baseUrl ?>/img/icone.png" style="height:61.25px" alt="Logo Ave Ecclesia">
			<div class="sr-only">Ave Ecclesia</div>
		</div>
		<div class="col-lg-4 col-md-6 mx-auto">
			<?php
			// Show error
			if (isset($_SESSION['error'])) {
				alert('danger', $_SESSION['error']);
				unset($_SESSION['error']);
			}

			// Path de redirect
			$path = isset($req->query->redirect) ? $req->query->redirect : '/';

			// Inicio do form
			form_inicio('login', 'post', '/auth/login?redirect='.$path, '');

			// Inputs do form
			echo '<div class="row">';
			form_input('Usuário', 'user', required);
			form_input('Senha', 'pass', ['type' => 'password', required]);
			echo '</div>';

			?>
			<button class="g-recaptcha btn btn-lg btn-success btn-block" onclick="on_click_login()" data-sitekey="6LdaFlMUAAAAAP9Qv_h5OZidM2rv3XcjqWxxaqc4" data-callback="do_login">Entrar</button>
			<?php form_fim() ?>
		</div>
	</div>
	<footer class="footer d-flex flex-row-reverse">
		<div class="col-sm-9 ml-sm-auto col-md-12">
			<div class="row">
				<div class="container">
					<span class="text-muted">Vertex Group Technology - Todos direitos reservados.</span>
				</div>
			</div>
		</div>
	</footer>
</body>
</html>

<?php
function menu($res, array $menus)
{
	global $app;
	?>
	<ul class="nav nav-pills flex-column">
		<?php
		foreach ( $menus as $menu ) :

			// Verifica se o usuário tem a permissão necessária
			if (isset($menu['permission']) and !$res->user_can($menu['permission'])) {
				continue;
			}

			// Define se é uma rota ativa ou não
			$active = match_url($menu['uri']);

			if (isset($menu['sub'])) :
				?>
				<li class="nav-item">
					<a class="nav-link collapse-link <?=$active ? '' : 'collapsed'?>" data-toggle="collapse" href="<?=$menu['uri']?>" role="button" aria-expanded="false" aria-controls="<?=$menu['uri']?>"><? isset($menu['icon']) ? fa_icon($menu['icon']) : '' ?><?=$menu['title']?></a>
					<div class='collapse <?=$active ? 'show' : ''?>' id='<?=ltrim($menu['uri'], '#')?>'>
						<? menu($res, $menu['sub']) ?>
					</div>
				</li>
			<?php else : ?>
				<li class="nav-item">
					<a class="nav-link <? active_url($menu['uri']) ?>" href="<?=$app->mounturl.$menu['uri']?>"><? isset($menu['icon']) ? fa_icon($menu['icon']) : '' ?><?= $menu['title'] ?></a>
				</li>
			<?php endif;
		endforeach; ?>
	</ul>
	<?php
}

function fa_icon($icon) {
	echo "<i class='fa fa-$icon'></i> ";
}

function match_url($url)
{
	if (!empty($url))
	{
		$url = ltrim($url, '#');

		// Caso seja rota de meio (dropdown) ele cai aqui
		if (strpos($_SERVER['REQUEST_URI'], $url.'/') !== false) {
			return true;
		}

		// Senão verifica se termina com a rota informada
		if (preg_match("#{$url}$#", $_SERVER['REQUEST_URI'])) {
			return true;
		}
	}

	return false;
}

function active_url($url)
{
	echo match_url($url) ? ' active' : '';
}

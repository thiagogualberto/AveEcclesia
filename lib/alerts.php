<?php
function alert($type, $message)
{
	?>
	<div class="alert alert-<?=$type?>" role="alert">
		<strong><?=$message?></strong>
	</div>
	<?php
}
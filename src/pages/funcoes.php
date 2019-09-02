<?php
include 'src/template/header_sidebar.php';
include 'lib/forms.php';
?>

<h1>Funções</h1>

<script type="text/javascript">
	var events = {
		'click .edit': function (e, value, row, index) {
			$('#modalLabel').text('Editar função')
			$('#form_funcao').fromObject(row)
			$('#createFuncao').modal('show')
		},
		'click .status': function (e, value, row, index) {
			$.put(mounturl+'/api/funcoes/'+row.id, {ativo: !(row.ativo == 1)}, function (resp) {
				$('table').bootstrapTable('refresh', {silent: true})
			})
		}
	};	

	tableOptions = {
		sidePagination: 'client',
		toolbar: '#toolbar'
	}

	function actions(value, row, index, field) {
		return [
			Action('edit', 'Editar', '', {className: 'edit'}),
			Action('trash', 'Excluir', '#dc3545', {className: 'delete'}),
			Actions(row.ativo == 1, ['toggle-on', 'Desativar', '', {className: 'status'}], ['toggle-off', 'Ativar', '', {className: 'status'}])
		]
	}

	function render_inativo(value, row, index, field) {
		return row.ativo == 1 ? value : '<del>'+value+'</del>'
	}

	// $(document).ready(function () {

	// 	$('#createFuncao').on('show.bs.modal', function (event) {

	// 		const button = $(event.relatedTarget)
	// 		const index = button.data('index')

	// 		if (index != undefined) {

	// 			// const data = $('table').bootstrapTable('getData')[index];
	// 			$('#modalLabel').text('Editar função')
	// 			// $('#form_funcao').fromObject(data)
	// 		} else {
	// 			$('#modalLabel').text('Adicionar função')
	// 			// $('#form_funcao').clear();
	// 		}
	// 	})
	// })
</script>

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" id="toolbar" data-toggle="modal" data-target="#createFuncao">
	<i class="fa fa-plus"></i> Adicionar função
</button>

<? form_inicio('form_funcao', 'post', 'api/funcoes', '') ?>
<!-- Modal -->
<div class="modal fade" id="createFuncao" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalLabel">Adicionar função</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<?php
				form_input('Função', ['name' => 'nome', 'required' => true]);
				// form_input_hidden('funcao', $req->user->diocese_id);
				?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
				<button type="submit" class="btn btn-primary">Salvar</button>
			</div>
		</div>
	</div>
</div>
<? form_fim() ?>

<table class="table" data-pagination="true" data-search="true" data-url="/aveecclesia/api/funcoes">
	<thead>
		<tr>
			<th data-formatter="render_inativo" data-sortable="true" data-field="nome">Função</th>
			<th data-formatter="render_actions" data-events="events" data-width="130px" data-halign="center">Ações</th>
		</tr>
	</thead>
</table>

<?php
include 'src/template/footer.php';

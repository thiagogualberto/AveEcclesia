import api from '../api'

export const loadMembro = pessoa_id => ({
	type: 'LOAD_MEMBRO',
	payload: api.loadData('/membros/'+pessoa_id)
})

export const loadDizimista = pessoa_id => ({
	type: 'LOAD_DIZIMISTA',
	payload: api.loadData('/membros/' + pessoa_id + '/dizimista')
})

export const loadBatismo = pessoa_id => ({
	type: 'LOAD_BATISMO',
	payload: api.loadData('/membros/' + pessoa_id + '/batismo')
})

export const loadCrisma = pessoa_id => ({
	type: 'LOAD_CRISMA',
	payload: api.loadData('/membros/' + pessoa_id + '/crisma')
})

export const loadMatrimonio = pessoa_id => ({
	type: 'LOAD_MATRIMONIO',
	payload: api.loadData('/membros/' + pessoa_id + '/matrimonio')
})

export const updateMembro = (path, data, id = undefined) => ({
	type: 'UPDATE_MEMBRO',
	payload: api.editData(path, data, id)
})

export const updateForm = (form, data) => ({
	type: 'UPDATE_FORM',
	payload: {
		form: { [form]: data },
		membro: { [`ie_${form}`]: data }
	}
})

export const editForm = form => ({
	type: 'SET_EDIT',
	payload: { edit: true, form }
})

export const closeForm = () => ({
	type: 'SET_EDIT',
	payload: { edit: false, form: '' }
})
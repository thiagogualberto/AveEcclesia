import { create, CancelToken } from 'axios'

const api = create({
	baseURL: window.mounturl + '/api/',
	headers: {
		'Content-Type': 'application/json'
	}
})

class RequestHandler {

	constructor () {
		this.source = CancelToken.source()
		this._token = this.source.token
	}

	get token () {

		this.source = CancelToken.source()
		this._token = this.source.token

		return this
	}
	
	cancel (msg) {
		this.source.cancel(msg)
	}
}

export const handler = new RequestHandler

export default {
	request: config => api.request(config),
	loadContas: () => api.get('contas'),
	suggestion: (model, search, cancelToken, filter = 'nome') => api.get(model, { params: { filter, search }, cancelToken }),

	loadData: (path, params, token = undefined) => api.get(path, { params, cancelToken: token && token._token }),
	sendData: (path, data, put) => put === true ? api.put(`${path}/${data.id}`, data) : api.post(path, data),
	postData: (path, data) => api.post(path, data),
	editData: (path, data, id = undefined) => api.put(`${path}/${id || data.id}`, data),
	deleteItem: (path, id) => api.delete(`${path}/${id}`),
	deleteData: (path, rows) => api.delete(path, { params: { ids: rows.map(row => row.id).join(',') } })
}
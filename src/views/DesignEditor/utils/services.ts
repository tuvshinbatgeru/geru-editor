import { request } from '../../../services/api'

// STICKER'S APIS
export async function fetchStickers() {
	return await request().get('/api/sticker/all')
}

export async function fetchPacks() { 
	return await request().get('/api/pack/all')
}

export async function fetchFonts() {
	return await request().get('/api/font')
}

export async function searchFont(params) {
	return await request().get('/api/font/search', {
		params
	})
}

export async function checkLicencedStickers(params) {
	return await request().post('/api/sticker/filtered_stickers', params)
}

export async function backgroundRemove(params) {
	return await request().post('/api/customization/background-remove', params)
}

export async function fetchUserUploads(user_id, params) {
	return await request().get(`/api/user/${user_id}/file`, {
		params
	})
}

export async function fileUpload(user_id, file) {
	return await request().post(`/api/user/${user_id}/file`, {
		file
	})
}

export async function deleteTemplate(id) {
	return await request().delete('/api/template/' + id)
}
export async function fetchTemplates() {
	return await request().get('/api/template')
}
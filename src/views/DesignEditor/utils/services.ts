import { request } from '../../../services/api'
import axios from 'axios'
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/urlan/'
const CLOUDINARY_KEY = "359513655322777"
const PRESET = 'tyt2eb9j'
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

export async function saveTemplate(params) {
	return await request().post('/api/template', params)
}

export function uploadTemporaryArtwork(file, public_id, callback) {
	const formData = new FormData()
	formData.append('upload_preset', PRESET)
	formData.append('folder', '/geru-by-me/temporary')
	formData.append('public_id', public_id)
	formData.append('file', file)

	axios
        .post(`${CLOUDINARY_URL}image/upload`, formData)
        .then(res => {
            callback(null, res.data)
        }) 
        .catch(err => callback(err))
}

export function backgroundRemovedImageUpload(file, callback) {
    const formData = new FormData()
	formData.append('upload_preset', PRESET)
	formData.append('folder', '/geru-by-me/backgroundremove')
	formData.append('file', file)
    axios
	.post(`${CLOUDINARY_URL}image/upload`, formData)
	.then(res => {
		callback(null, res.data)
	}) 
	.catch(err => callback(err))
}


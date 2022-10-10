import { request } from '../../../services/api'

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
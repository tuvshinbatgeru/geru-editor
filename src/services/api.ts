import axios, { AxiosInstance } from "axios"
import { Resource } from "~/interfaces/editor"
import Cookies from 'js-cookie'
type IElement = any
type IFontFamily = any
type IUpload = any
type Template = any

export const BASE_URL = 'https://geru-rest-api.herokuapp.com'

export function request(headerOptions) {
    let token = Cookies.get('token')
    let referral = Cookies.get('referral')

    let query = {
        // timeout: TIMEOUT,
        baseURL: BASE_URL + '/'
    }

    if (headerOptions) {
        Object.assign(query, {
            headers: {
                ...headerOptions
            }
        })
    }

    if (token) {
        Object.assign(query, {
            headers: {
                Authorization: 'bearer ' + token
            },
        })
    }

    if (referral) {
        if (query.headers) {
            query.headers['referral'] = referral
        } else {
            Object.assign(query, {
                headers: {
                    referral,
                }
            })
        }
    }

    return axios.create(query)
}

//export async function fetchPacks() { 
//	return await this.request().get('/api/pack/all')
//}

//export async function fetchFonts() {
//	return await this.request().get('/api/font')
//}

//export async function searchFont(params) {
//	return await this.request().get('/api/font/search', {
//		params
//	})
//}

//export async function checkLicencedStickers(params) {
//	return await this.request().post('/api/sticker/filtered_stickers', params)
//}

//export async function backgroundRemove(params) {
//	return await this.request().post('/api/customization/background-remove', params)
//}

//class ApiService {
//  base: AxiosInstance
//  constructor() {
//    this.base = axios.create({
//      // baseURL: "http://localhost:8080",
//    //  baseURL: "https://burly-note-production.up.railway.app",
//      baseURL: "https://geru-rest-api.herokuapp.com",
//      headers: {
//        Authorization: "Bearer QYT8s1NavSTpTAxURji98Fpg",
//      },
//    })
//  }

//  signin(props: any) {
//    return new Promise((resolve, reject) => {
//      this.base
//        .post("/auth/signin", props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }
//  fetchPacks(): Promise<{ url: string }> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .get("/api/sticker/all")
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }
  
//  // UPLOADS
//  getSignedURLForUpload(props: { name: string }): Promise<{ url: string }> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .post("/uploads", props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  updateUploadFile(props: { name: string }): Promise<any> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .put("/uploads", props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  getUploads(): Promise<IUpload[]> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get("/uploads")
//        resolve(data.data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }

//  deleteUpload(id: string) {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const response = await this.base.delete(`/uploads/${id}`)
//        resolve(response)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }

//  // TEMPLATES

//  createTemplate(props: Partial<Template>): Promise<Template> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .post("/templates", props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  createComponent(props: Partial<any>): Promise<any> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .post("/components", props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  getComponents(): Promise<any[]> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get("/components")
//        resolve(data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }

//  deleteTemplate(id: string): Promise<Template> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .delete(`/templates/${id}`)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  deleteComponent(id: string): Promise<Template> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .delete(`/components/${id}`)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  downloadTemplate(props: Partial<Template>): Promise<{ source: string }> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .post("/templates/download", props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  getTemplates(): Promise<any[]> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get("/templates")
//        resolve(data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }

//  getTemplateById(id: string): Promise<any> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get(`/templates/${id}`)
//        resolve(data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }
//  //CREATIONS

//  createCreation(props: Partial<Template>): Promise<Template> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .post("/creations", props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  getCreations(): Promise<any[]> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get("/creations")
//        resolve(data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }

//  getCreationById(id: string): Promise<any> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get(`/creations/${id}`)
//        resolve(data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }
//  updateCreation(id: string, props: Partial<Template>): Promise<Template> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .put(`/creations/${id}`, props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  // ELEMENTS
//  getElements(): Promise<IElement[]> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get("/elements")
//        resolve(data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }
//  updateTemplate(id: string, props: Partial<Template>): Promise<Template> {
//    return new Promise((resolve, reject) => {
//      this.base
//        .put(`/templates/${id}`, props)
//        .then(({ data }) => {
//          resolve(data)
//        })
//        .catch((err) => reject(err))
//    })
//  }

//  // FONTS
//  getFonts(): Promise<IFontFamily[]> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get("/fonts")
//        resolve(data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }

//  getPixabayResources(): Promise<Resource[]> {
//    return new Promise(async (resolve, reject) => {
//      try {
//        const { data } = await this.base.get("/resources/pixabay?query=flower")
//        resolve(data.data)
//      } catch (err) {
//        reject(err)
//      }
//    })
//  }
//}

//export default new ApiService()

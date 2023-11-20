import axios from "axios"
import Cookies from 'js-cookie'

export function request(headerOptions) {
    let token = Cookies.get('token')
    let referral = Cookies.get('referral')
    const BASE_URL = Cookies.get('BASE_URL') ? Cookies.get('BASE_URL') : 'https://geru-rest-api.herokuapp.com'
    // const BASE_URL = "http://localhost:3006"

    // alert(token)

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
import axios from 'axios';
import storage from "@/store/storage.js"

class apiService {

    async get(endpoint, params = '') {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Time-Zone': storage.get('timezone')
            }
        }

        const url = `${process.env.VUE_APP_JUICYLLAMA_URL}${endpoint}?app_id=${process.env.VUE_APP_JUICYLLAMA_APP_ID}&app_api_key=${process.env.VUE_APP_JUICYLLAMA_API_KEY}${params}`

        try {
            let response = await axios.get(url, config)
            return response.data

        }catch(error){
            return false
        }
    }

    async post(endpoint, data, params = '') {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Time-Zone': storage.get('timezone')
            }
        }

        const url = `${process.env.VUE_APP_JUICYLLAMA_URL}${endpoint}?app_id=${process.env.VUE_APP_JUICYLLAMA_APP_ID}&app_api_key=${process.env.VUE_APP_JUICYLLAMA_API_KEY}${params}`

        try {
            let response = await axios.post(url, data, config)
            return response.data

        }catch(error){
            return false
        }
    }

    async put(endpoint, data, params = '') {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Time-Zone': storage.get('timezone')
            }
        }

        const url = `${process.env.VUE_APP_JUICYLLAMA_URL}${endpoint}?app_id=${process.env.VUE_APP_JUICYLLAMA_APP_ID}&app_api_key=${process.env.VUE_APP_JUICYLLAMA_API_KEY}${params}`

        try {
            let response = await axios.put(url, data, config)
            return Number(response.status) === 204;

        }catch(error){
            return false
        }
    }

    async delete(endpoint, params = '') {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Time-Zone': storage.get('timezone')
            }
        }

        const url = `${process.env.VUE_APP_JUICYLLAMA_URL}${endpoint}?app_id=${process.env.VUE_APP_JUICYLLAMA_APP_ID}&app_api_key=${process.env.VUE_APP_JUICYLLAMA_API_KEY}${params}`

        try {
            await axios.delete(url, config)
            return true

        }catch(error){
            return false
        }
    }
}


export default new apiService();

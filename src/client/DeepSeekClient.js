const axios = require("axios");

const URL = "https://api.deepseek.com"
const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.DEEPSEEK_TOKEN}`
}

class DeepSeekClient {
    constructor() {
    }

    async chat(requestData) {
        try {
            const url = `${URL}/chat/completions`;
            const response = await axios.post(url, requestData, { headers: header });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        const errorMessage = error?.response?.data || error.message;
        throw new Error(errorMessage);
    }
}

module.exports = DeepSeekClient;

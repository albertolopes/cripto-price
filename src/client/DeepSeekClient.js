const axios = require("axios");

class DeepSeekClient {
    constructor(token, apiUrl = "https://api.deepseek.com") {
        this.token = token;
        this.apiUrl = apiUrl;
        this.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
        };
    }

    async chat(requestData) {
        try {
            const url = `${this.apiUrl}/chat/completions`;
            const response = await axios.post(url, requestData, { headers: this.headers });

            if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
                return {
                    message: response.data.choices[0].message, // Conteúdo de choices[0].message
                    usage: response.data.usage,
                    id: response.data.id,
                    created: response.data.created
                };
            } else {
                throw new Error("Resposta da API não contém 'choices[0].message'.");
            }

        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        const errorMessage = error?.response?.data || error.message;
        console.error("Erro na API DeepSeek:", errorMessage);
        throw new Error(errorMessage);
    }
}

module.exports = DeepSeekClient;

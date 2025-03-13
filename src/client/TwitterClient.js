const axios = require("axios");
const { TwitterApi } = require('twitter-api-v2');

require('dotenv').config({ path: '.env.local' });

class TwitterClient {
    constructor() {
        this.twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });

        this.client = this.twitterClient.readWrite;
    }

    async tweet(text) {
        try {
            const response = await this.client.v2.tweet(text);
            console.log('✅ Tweet enviado com sucesso:', response);
            return response;
        } catch (error) {
            console.error('❌ Erro ao enviar tweet:', error);
            throw new Error(error);
        }
    }
}

module.exports = TwitterClient;
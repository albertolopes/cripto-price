class TelegramUpdateResult {
    constructor(update) {
        this.update_id = update.update_id;
        this.message = new TelegramMessage(update.message);
    }
}

class TelegramMessage {
    constructor(message) {
        this.message_id = message.message_id;
        this.from = new TelegramUser(message.from);
        this.chat = new TelegramChat(message.chat);
        this.date = message.date;
        this.text = message.text;
    }
}

class TelegramUser {
    constructor(user) {
        this.id = user.id;
        this.is_bot = user.is_bot;
        this.first_name = user.first_name;
        this.language_code = user.language_code;
    }
}

class TelegramChat {
    constructor(chat) {
        this.id = chat.id;
        this.first_name = chat.first_name;
        this.type = chat.type;
    }
}

class TelegramChatDTO {
    constructor(payload) {
        this.ok = payload.ok;
        this.result = payload.result.map(update => new TelegramUpdateResult(update));
    }
}

module.exports = TelegramChatDTO;
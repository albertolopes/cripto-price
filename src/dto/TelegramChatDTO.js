class TelegramUpdateResult {
    constructor(update) {
        this.update_id = update.update_id;

        if (update.message) {
            this.message = new TelegramMessage(update.message);
        }

        if (update.my_chat_member) {
            this.my_chat_member = new TelegramChatMemberUpdate(update.my_chat_member);
        }
    }
}

class TelegramMessage {
    constructor(message) {
        this.message_id = message.message_id;
        this.from = new TelegramUser(message.from);
        this.chat = new TelegramChat(message.chat);
        this.date = message.date;
        this.text = message.text || null; // Nem todas as mensagens têm texto
    }
}

class TelegramUser {
    constructor(user) {
        this.id = user.id;
        this.is_bot = user.is_bot;
        this.first_name = user.first_name;
        this.last_name = user.last_name || null; // Alguns usuários têm sobrenome
        this.username = user.username || null;
        this.language_code = user.language_code || null;
    }
}

class TelegramChat {
    constructor(chat) {
        this.id = chat.id;
        this.first_name = chat.first_name;
        this.last_name = chat.last_name || null;
        this.username = chat.username || null;
        this.type = chat.type;
    }
}

class TelegramChatMemberUpdate {
    constructor(update) {
        this.chat = new TelegramChat(update.chat);
        this.from = new TelegramUser(update.from);
        this.date = update.date;
        this.old_chat_member = new TelegramChatMember(update.old_chat_member);
        this.new_chat_member = new TelegramChatMember(update.new_chat_member);
    }
}

class TelegramChatMember {
    constructor(member) {
        this.user = new TelegramUser(member.user);
        this.status = member.status;
        this.until_date = member.until_date || null; // Se não existir, define como null
    }
}

class TelegramChatDTO {
    constructor(payload) {
        this.ok = payload.ok;
        this.result = payload.result.map(update => new TelegramUpdateResult(update));
    }
}

module.exports = TelegramChatDTO;

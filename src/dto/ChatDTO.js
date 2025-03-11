class ChatDTO {
    constructor(model, messages, stream) {
        this.model = model;
        this.messages = messages.map(msg => new ChatMessage(msg.role, msg.content));
        this.stream = stream;
    }

    toJSON() {
        return {
            model: this.model,
            messages: this.messages.map(msg => msg.toJSON()),
            stream: this.stream
        };
    }
}

class ChatMessage {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }

    toJSON() {
        return {
            role: this.role,
            content: this.content
        };
    }
}

module.exports = ChatDTO;

const generateUsername = (telegramId) => {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `user_${telegramId}_${randomString}`;
}

module.exports = generateUsername;
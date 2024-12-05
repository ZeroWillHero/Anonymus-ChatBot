const bot = require('./../Chat/chatBot');
const createReport = require('./../routes/report/controller/createReport');

const reportingComp =async (recipientId, telegram_id) => {
    const reporting_keys = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '👍', callback_data: 'like' },
                    { text: '👎', callback_data: 'dislike' },
                ],
                [
                    { text: '⚠️ Report →', callback_data: 'report' }
                ],
            ],
        },
    };

    // Send initial feedback message
    bot.sendMessage(telegram_id, 'If you wish, leave your feedback about your partner. It will help us find better partners for you in the future', reporting_keys);
    bot.sendMessage(recipientId, 'If you wish, leave your feedback about your partner. It will help us find better partners for you in the future', reporting_keys);

    // Handle button presses
    bot.on('callback_query', async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        // Reusable components
        const report_keys = {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📢 Advertising', callback_data: 'report_advertising' }],
                    [{ text: '💰 Selling', callback_data: 'report_selling' }],
                    [{ text: '🔞 Child porn', callback_data: 'report_child_porn' }],
                    [{ text: '🙇 Begging', callback_data: 'report_begging' }],
                    [{ text: '😡 Insulting', callback_data: 'report_insulting' }],
                    [{ text: '⚠️ Violence', callback_data: 'report_violence' }],
                    [{ text: '❌ Vulgar partner', callback_data: 'report_vulgar_partner' }],
                    [{ text: '⬅️ Back', callback_data: 'report_back' }],
                ],
            },
        };

        // Handle 'Report' button click
        if (data === 'report') {
            // Update message with report options
            bot.editMessageText('Choose a reason:', report_keys);
        }

        // Handle 'Back' button click
        if (data === 'report_back') {
            // Update message with initial feedback prompt
            bot.editMessageText('If you wish, leave your feedback about your partner. It will help us find better partners for you in the future', {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '👍', callback_data: 'like' },
                            { text: '👎', callback_data: 'dislike' },
                        ],
                        [
                            { text: '⚠️ Report →', callback_data: 'report' }
                        ],
                    ],
                },
            });
        }else if (data === "report_advertising" || data === "report_selling" || data === "report_child" || data === "report_begging" || data === "report_insulting" || data === "report_violence" || data === "report_vulgar_partner") {
            // reporting the user 
           

            const report = await createReport(telegram_id, recipientId, data);
            console.log(report);

            // after reporting i want to clear the above message 
            bot.editMessageText('Reported', {
                chat_id: chatId,
                message_id: messageId,
            });
            
        }
    });
};

module.exports = reportingComp;

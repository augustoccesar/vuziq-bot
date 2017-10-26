require('./initializers/setup');

const TelegramBot = require('node-telegram-bot-api');
const restify = require('restify');
const {load_filter} = require('./lib/filters');

const url = 'https:///vuziq-bot.herokuapp.com';
const port = process.env.PORT || 3000;
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

const server = restify.createServer({});

// Server config

server.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.send(200);
});

server.listen(port, () => {
    console.log(`Listening at ${port}`)
});

// Telegram config

bot.setWebHook(`${url}/bot${token}`);

const greetings = [
    "De boa?",
    "Tranquilo?",
    "Suave?"
];

const known_people = [
    'fabricio'
];

bot.onText(/\/echo(@VuziqBot)? (.+)/, (msg, match) => {
    load_filter(bot, msg, () => {
        bot.getChat(msg.chat.id).then(() => {
            bot.sendMessage(msg.chat.id, match[2]).then();
        });
    });
});

bot.onText(/\/gemidao(@VuziqBot)?/, (msg) => {
    load_filter(bot, msg, () => {
        bot.sendVoice(msg.chat.id, 'public/audios/gemidao.mp3');
    });
});

bot.onText(/\/ola(@VuziqBot)?/, (msg) => {
    load_filter(bot, msg, () => {
        let message = `Falaê, ${msg.from.first_name}. ${greetings[Math.floor(Math.random() * greetings.length)]}`;
        bot.sendMessage(msg.chat.id, message).then();
    });
});

bot.onText(/\/bow(@VuziqBot)?/, (msg) => {
    load_filter(bot, msg, () => {
        bot.sendMessage(msg.chat.id, 'Cê bebe?').then();
    });
});

bot.onText(/\/acordar(@VuziqBot)?\s+(.+)/, (msg, match) => {
    load_filter(bot, msg, () => {
        let who = match[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if(known_people.includes(who)){
            bot.sendVoice(msg.chat.id, `public/audios/wake_${who}.mp3`);
        }else{
            bot.sendMessage(msg.chat.id, `Sei quem é ${match[2]} não...`).then();
        }
    });
});



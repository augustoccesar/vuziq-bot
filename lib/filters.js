const moment = require('moment');

const MAX_MESSAGE_COUNT = 3;
const LOCK_TIME = 60;

const db = require('./database');

const load_filter = function (bot, message, next) {
    let registered_user = db.get('users').find({id: message.from.id}).value();

    if(registered_user){
        let was = moment(registered_user.throttle.last_message_time);
        let now = moment.utc().toISOString();

        if (registered_user.throttle.message_count === MAX_MESSAGE_COUNT) {
            if(moment(was).add(LOCK_TIME, 'seconds') > moment(now)){
                bot.sendMessage(message.chat.id, `Ow ${message.from.first_name}, cala só um pouquinho...`).then();
            } else {
                db.get('users')
                    .find({id: message.from.id})
                    .assign({ throttle: {message_count: 1, last_message_time: new Date().getTime()}})
                    .write();
                next();
            }
        }else{
            db.get('users')
                .find({id: message.from.id})
                .assign({ throttle: {message_count: registered_user.throttle.message_count + 1, last_message_time: new Date().getTime()}})
                .write();
            next();
        }
    }else{
        let user = {
            id: message.from.id,
            username: message.from.username,
            throttle: {
                message_count: 1,
                last_message_time: moment().utc().toISOString()
            }
        };
        db.get('users').push(user).write();
        next();
    }
};

module.exports.load_filter = load_filter;
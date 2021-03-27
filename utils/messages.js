const moment = require('moment');// we are useing here the moment module for accessing date and time

function formatMessage(username,text){
    return{
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports=formatMessage;
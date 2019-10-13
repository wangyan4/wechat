const formatMsg = require('./fmtwxmsg.js');

function help() {
    return '用户你好，这是一个微信测试号，会原样返回用户消息，目前不支持视视频消息';
}

// 第一个参数是解析后的用户消息
// 第二个参数是要返回的消息对象
// 基本处理过程:根据用户发过来的消息判断消息类型并处理
function userMsg(wxmsg, retmsg) {
    if (wxmsg.MsgType === 'text') {
        retmsg.msgtype = 'text';
        switch (wxmsg.Content) {
            case 'help':
            case '?':
            case '？':
            case '帮助':
                retmsg.msg = help();
                return formatMsg(retmsg);
            case 'about':
                retmsg.msg = '我是这个测试号的开发者';
                return formatMsg(retmsg);
            case 'who':
                retmsg.msg = '姓名：王炎；学号：2017011839；班级：4班；';
                return formatMsg(retmsg);
            default:
                retmsg.msg = wxmsg.Content;
                return formatMsg(retmsg);
        }
    }
    //非文本类型的消息处理
    switch (wxmsg.MsgType) {
        case "image":
        case "audio":
            retmsg.msgtype = wxmsg.MsgType;
            retmsg.msg = wxmsg.MediaId;
            return formatMsg(retmsg);
        default:
            return formatMsg(retmsg);

    }
}

exports.help = help;
exports.userMsg = userMsg;

exports.msgDispatch = function msgDispatch(wxmsg, retmsg) {
    return userMsg(wxmsg, retmsg)
}
const titbit = require('titbit');
const crypto = require('crypto');
const wxmsg = require('./weixinmsg');
const parsexml = require('xml2js').parseString;
var app = new titbit();


app.router.get('/wx/msg', async c => {
    var token = 'msgtalk';

    var urlargs = [
        c.query.nonce,
        c.query.timestamp,
        token
    ];

    urlargs.sort();  //字典排序

    var onestr = urlargs.join(''); //拼接成字符串
    
	//生成sha1签名字符串
    var hash = crypto.createHash('sha1');
    var sign = hash.update(onestr);
		
    if (c.query.signature === sign.digest('hex')) {
        c.res.body = c.query.echostr;
    }
});

app.router.post('/wx/msg',async c=>{
    try {
        let data = await new Promise((rv,rj)=>{
            parsexml(c.body,{explicitArray:false},(err,result)=>{
                if(err){
                    rj(err);
                }else{
                    rv(result.xml);
                }
            })
        })
        let retmsg = {
            touser:data.FromUserName,
            fromuser:data.ToUserName,
            msgtype:'',
            msgtime:parseInt(Date.now()/1000)
        };
        c.res.body = wxmsg.msgDispatch(data,retmsg);
    } catch (error) {
        console.log(error);
    }
})


app.run(8002,'localhost');
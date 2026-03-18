const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

// سيرفر الفزعة عشان Render المجاني ما يطفي
http.createServer((req, res) => {
    res.write('Secretary is Running');
    res.end();
}).listen(process.env.PORT || 3000);

// حط مفتاح Gemini حقك هنا
const genAI = new GoogleGenerativeAI("AIzaSyD6S_TOn04vG6FvJv5S0S0S0S0S0S0S0S0"); 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('عمر.. امسح الباركود الحين من الـ Logs:');
});

client.on('ready', () => {
    console.log('تم الربط بوقار حائلي!');
});

client.on('message', async (msg) => {
    if (!msg.from.includes('@g.us')) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
            const prompt = `أنت مساعد إداري شخصي للأستاذ عمر. أسلوبك حائلي، رايق جداً، هادئ ومؤدب. ناده دائماً باسمه "يا هلا والله بعمر". نفذ طلبه بوقار: ${msg.body}`;
            const result = await model.generateContent(prompt);
            msg.reply(result.response.text());
        } catch (err) {
            console.log("خطأ في Gemini: ", err);
        }
    }
});

client.initialize();

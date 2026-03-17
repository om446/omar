const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// تم حقن مفتاح عمر الخاص هنا بوقار
const genAI = new GoogleGenerativeAI("AIzaSyD6S_TOn04vG6FvJv5S0S0S0S0S0S0S0S0"); 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--single-process'
        ]
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('عمر.. الرادار جاهز، امسح الباركود الحين بجوالك:');
});

client.on('ready', () => {
    console.log('تم الربط بنجاح.. سكرتير عمر باشر العمل بوقار!');
});

client.on('message', async (msg) => {
    if (!msg.from.includes('@g.us')) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
            const prompt = `أنت مساعد ذكي وسكرتير شخصي لعمر. أسلوبك: حائلي، وقور، رايق، سنع، ومختصر بذكاء. رد على: ${msg.body}`;
            const result = await model.generateContent(prompt);
            msg.reply(result.response.text());
        } catch (error) {
            console.error('فيه مشكلة بالرادار:', error);
        }
    }
});

client.initialize();

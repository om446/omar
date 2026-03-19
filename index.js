const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

// 1. سيرفر الفزعة عشان Render ما يطفي السكرتير
http.createServer((req, res) => {
    res.write('Secretary is Running with Dignity');
    res.end();
}).listen(process.env.PORT || 3000);

// 2. إعدادات Gemini (حط مفتاحك هنا بوقار)
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY_HERE");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// 3. تشغيل الواتساب بـ "إعدادات السحابة" الصارمة
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu'
        ],
    }
});

// 4. بث الباركود في اللوجز بوقار
client.on('qr', (qr) => {
    console.log('يا عمر، امسح الباركود الحين بوقار:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('تم الربط بوقار حائلي.. السكرتير جاهز للخدمة!');
});

// 5. منطق الرد (الرادار التقني)
client.on('message', async (msg) => {
    if (msg.body.startsWith('!عمر')) {
        try {
            const prompt = msg.body.replace('!عمر', '').trim();
            const result = await model.generateContent(prompt);
            const response = await result.response;
            msg.reply(response.text());
        } catch (error) {
            console.error("خطأ في الرادار:", error);
            msg.reply("المعذرة يا بعد حي، فيه خلل بسيط في السيولة المعلوماتية.");
        }
    }
});

client.initialize();

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const OpenAI = require("openai");
const app = express();
const port = 3000;

const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    const chatHistory = req.body.prompt;
    const systemMessage = {
        role: "system",
        content: "You are a helpful assistant.",
    };
    chatHistory.unshift(systemMessage);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chatHistory,
            max_tokens: 60,
        });
        console.log(response);
        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.toString() });
    }
});

const httpsOptions = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
};

https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Server running at https://207.199.235.110:${port}/`);
});

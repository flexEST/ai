const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

// API açarını buraya yaz (öz şəxsi açarını)
const openai = new OpenAIApi(new Configuration({
  apiKey: "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"  // <- BURAYA SƏNİN OPENAI API AÇARIN
}));

// ChatGPT cavabı
app.post("/ask", async (req, res) => {
  try {
    const message = req.body.message;
    const chat = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0.7
    });
    const reply = chat.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("GPT xətası:", err.message);
    res.json({ reply: "Bağışlayın, cavab verə bilmədim." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server hazırdır: http://localhost:${PORT}`);
});

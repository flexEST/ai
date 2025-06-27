const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));

// ⛔ Açarını bura yaz — lakin bunu yalnız test üçün et
const openai = new OpenAIApi(new Configuration({
  apiKey: "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"
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
    console.error("Chat error:", err);
    res.json({ reply: "Bağışlayın, cavab verə bilmədim." });
  }
});

// TTS cavabı
app.post("/speak", async (req, res) => {
  try {
    const text = req.body.text;
    const speech = await openai.createSpeech({
      model: "tts-1",
      voice: "nova",
      input: text
    }, { responseType: 'stream' });

    res.setHeader("Content-Type", "audio/mpeg");
    speech.data.pipe(res);
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).send("TTS xətası.");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server başladı: http://localhost:${PORT}`));

const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // HTML və video faylları burdan oxunur

// 🔑 API açarını buraya daxil et (gizli saxla!)
const openai = new OpenAIApi(new Configuration({
  apiKey: "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" // ← BURADA ÖZ OPENAI AÇARINI YAZ
}));

// 🎯 ChatGPT ilə cavab al
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("GPT xətası:", err.message);
    res.json({ reply: "Bağışlayın, cavab verə bilmədim." });
  }
});

// 🔊 OpenAI TTS ilə cavabı audioya çevir
app.post("/speak", async (req, res) => {
  try {
    const text = req.body.text;

    const speech = await openai.createSpeech({
      model: "tts-1", // və ya "tts-1-hd"
      voice: "nova",  // digər səslər: shimmer, onyx, fable...
      input: text
    }, { responseType: 'stream' });

    res.setHeader("Content-Type", "audio/mpeg");
    speech.data.pipe(res);
  } catch (err) {
    console.error("TTS xətası:", err.message);
    res.status(500).send("TTS işləmədi.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server işə düşdü: http://localhost:${PORT}`);
});

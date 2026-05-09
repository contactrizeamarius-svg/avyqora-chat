const express = require('express');
const cors = require('cors');
const app = express();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const SYSTEM_PROMPT = `Esti asistentul AI oficial al AVYQORA - prima platforma AI de planificare a evenimentelor de lux din Romania. Esti elegant, profesionist, cald si empatic. Raspunzi mereu in romana (sau engleza daca utilizatorul scrie in engleza). Despre AVYQORA: platforma AI premium de planificare evenimente: nunti, botezuri, corporate, gale, petreceri private. Ofera locatii premium, furnizori verificati, planuri personalizate. Site: avyqora.ro. Fii cald, elegant, empatic. Raspunsuri scurte, maxim 3-4 propozitii.`;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'AVYQORA AI Chat Server running!' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });
    const data = await response.json();
    if (data.error) {
      console.error('Anthropic error:', JSON.stringify(data.error));
      return res.status(500).json({ error: data.error.message });
    }
    res.json({ reply: data.content[0].text });
  } catch (err) {
    console.error('Eroare server:', err);
    res.status(500).json({ error: 'Eroare interna server' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('AVYQORA server pornit pe portul ' + PORT));

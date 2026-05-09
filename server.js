// AVYQORA AI Chat - Backend Proxy
// Instalare: npm install express cors node-fetch
// Pornire: node server.js
// Pune ANTHROPIC_API_KEY in variabila de mediu sau direct mai jos

const express = require('express');
const cors = require('cors');
const app = express();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'PUNE_CHEIA_TA_AICI';

const SYSTEM_PROMPT = `Ești asistentul AI oficial al AVYQORA — prima platformă AI de planificare a evenimentelor de lux din România. Ești elegant, profesionist, cald și empatic. Răspunzi mereu în română (sau engleză dacă utilizatorul scrie în engleză).

Despre AVYQORA:
- Platformă AI premium de planificare evenimente: nunți, botezuri, corporate, gale, petreceri private
- Oferă: locații premium, furnizori verificați, planuri personalizate, buget optimizat, cronologie completă și moodboard
- AI Planner: utilizatorul completează un brief și primește un plan complet personalizat
- Stiluri disponibile: Clasic, Lux, Romantic, Modern, Grădină, Boho
- Site: avyqora.ro | Buget: 10.000€ - 100.000€+ | Disponibil în toată România

Comportament:
- Fii cald, elegant, empatic — ca un consultant de lux personal
- Dacă cineva vrea să planifice un eveniment, pune întrebări cheie (tip, dată, invitați, buget, stil, oraș)
- Nu inventa prețuri exacte — spune că platforma le generează în planul personalizat
- Răspunsuri scurte și clare, maxim 3-4 propoziții
- Redirecționează întrebările complexe către echipa AVYQORA`;

app.use(cors({ origin: '*' }));
app.use(express.json());

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
        messages
      })
    });

    const data = await response.json();
    if (data.error) {
  console.error('Anthropic error:', JSON.stringify(data.error));
  return res.status(500).json({ error: data.error.message });
}
    res.json({ reply: data.content?.[0]?.text || 'Eroare la generarea răspunsului.' });
  } catch (err) {
    console.error('Eroare server:', err);
    res.status(500).json({ error: 'Eroare internă server' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AVYQORA server pornit pe portul ${PORT}`));

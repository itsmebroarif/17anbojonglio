import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: '17an Arena Backend' });
  });

  // Gemini AI Assistant Proxy Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is missing in server environment variables. Configure it in Secrets.'
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Build conversation contents for Gemini
      const contents = (messages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const defaultSystem = `Kamu adalah Panitia Digital 17an Arena, asisten cerdas untuk membantu Panitia Kemerdekaan RI (RT/RW/Sekolah/Perusahaan).
Tugasmu:
1. Membantu membuatkan draf pengumuman WhatsApp yang sopan & menarik untuk peserta atau warga.
2. Membantu membuat aturan lomba kustom (misal: Balap Karung, MLBB, Makan Kerupuk, Estafet Air).
3. Membantu menyusun susunan acara (rundown) dan sistem bracket pertandigan.
4. Menjawab pertanyaan teknis perlombaan 17 Agustus.
Berikan jawaban ringkas, jelas, ramah, dan bernuansa semangat Kemerdekaan Indonesia 🇮🇩!`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: systemInstruction || defaultSystem,
          temperature: 0.7
        }
      });

      const replyText = response.text || 'Maaf, tidak dapat menghasilkan tanggapan saat ini.';
      return res.json({ text: replyText });
    } catch (err: any) {
      console.error('Gemini API Chat Error:', err);
      return res.status(500).json({ error: err.message || 'Error processing AI chat request.' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`17an Arena server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { message } = req.body;

    // Define system prompt for OpenAI
    const systemPrompt = `
You are MTE Bot, an expert assistant from Mintienda Express. You are trained on https://minitienda.online/ and can assist with customer support, sales, lead capture, and lead qualification. You speak both Spanish and English fluently. Provide helpful and concise answers.

Eres MTE Bot, un asistente experto de Mintienda Express. Estás capacitado en https://minitienda.online/ y puedes ayudar con soporte al cliente, ventas, captura y calificación de clientes potenciales. Hablas español e inglés con fluidez. Proporciona respuestas útiles y concisas.
`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        res.status(500).json({ error: 'OpenAI API key not configured.' });
        return;
    }

    try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await openaiResponse.json();
        const reply = data.choices[0].message.content;

        res.status(200).json({ reply: reply });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: 'Error communicating with OpenAI API.' });
    }
};

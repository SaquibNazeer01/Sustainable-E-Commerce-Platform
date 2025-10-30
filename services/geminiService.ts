// Note: we avoid importing the server-side SDK at module load time so
// the client bundle won't fail if the SDK is Node-only. Instead we
// dynamically import inside createEcoBotChat. This keeps the app from
// crashing on initial render (which likely caused the dashboard not to load).

// System instruction for the EcoBot.
const ecoBotSystemInstruction = `You are EcoBot, a friendly and knowledgeable assistant for EcoShop, an online store dedicated to sustainable and eco-friendly products.
Your primary goal is to help users make informed, environmentally conscious decisions.
You are cheerful, encouraging, and an expert on sustainability.

- Answer questions about sustainable living, recycling, composting, and reducing carbon footprints.
- Provide information about the types of products sold on EcoShop (e.g., "What are beeswax wraps?", "Why are bamboo toothbrushes better?").
- Give tips on how to use the products effectively.
- Encourage users on their sustainability journey.
- Keep your answers concise, helpful, and easy to understand. Use emojis to make the conversation more engaging. 🌱🌍♻️
- Do not answer questions that are not related to sustainability, eco-friendly products, or EcoShop. Politely decline and steer the conversation back to your purpose.
`;

/**
 * In development we call a local proxy server (server.js) which keeps
 * the API key on the server. This function returns a small client-side
 * wrapper that exposes sendMessage(text) and hides network details.
 */
export async function createEcoBotChat() {
  // quick availability check - the server endpoint should be available
  // Default to local dev proxy server. Change VITE_API_PROXY_URL in .env.local
  // if you run the proxy on a different host/port.
  const endpoint = (import.meta.env.VITE_API_PROXY_URL ?? '') || 'http://localhost:4000';
  // Return an object with a compatible sendMessage API used by the component.
  return {
    sendMessage: async (payload) => {
      // payload may be an object with { text } or a string
      const message = typeof payload === 'string' ? payload : (payload.text || '');
      try {
        const res = await fetch((endpoint || '') + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'chat proxy error');
        }
        const data = await res.json();
        return { response: { text: () => data.text || '' } };
      } catch (err) {
        console.error('Chat proxy request failed:', err);
        throw err;
      }
    }
  };
}

const { getStore } = require('@netlify/blobs');

const KEY = 'cria-ativos-state.json';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  // Em alguns sites o Netlify não injeta o contexto de Blobs automaticamente
  // no runtime da função; nesse caso caímos para credenciais explícitas.
  const store = (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_API_TOKEN)
    ? getStore({ name: 'cria-ativos', siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_API_TOKEN })
    : getStore('cria-ativos');

  if (event.httpMethod === 'POST') {
    try {
      await store.set(KEY, event.body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: e.message }) };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const data = await store.get(KEY);
      if (!data) return { statusCode: 200, headers, body: JSON.stringify({ ok: false }) };
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: data,
      };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: '' };
};

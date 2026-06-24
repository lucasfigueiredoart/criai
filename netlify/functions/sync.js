const { getStore } = require('@netlify/blobs');

const KEY = 'cria-ativos-state.json';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const store = getStore('cria-ativos');

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

const BASE_URL = '/api/hs/hsprice/';
const API_KEY = import.meta.env.VITE_API_KEY;

const ERRORS = {
  'Empty key!': 'Не указан ключ покупателя',
  'Invalid key client!': 'Неверный ключ покупателя',
  'Empty number goods!': 'Не указан номер детали',
  'Request quota exceeded!': 'Превышен лимит запросов',
};

const normalizeError = (error) => {
  const list = Array.isArray(error) ? error : [error];
  return list.map((e) => ERRORS[e] || String(e)).join('; ');
};

export async function request(params, signal) {
  const query = new URLSearchParams({ key: API_KEY, ...params });

  let response;
  try {
    response = await fetch(`${BASE_URL}?${query}`, { signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error(
      'Не удалось связаться с сервером. Проверьте подключение к сети.'
    );
  }

  if (!response.ok) throw new Error(`Ошибка сервера (${response.status})`);

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Сервер вернул некорректный ответ');
  }

  if (data?.error) throw new Error(normalizeError(data.error));
  return data;
}

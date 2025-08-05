// api/telegram.js
export default async function handler(req, res) {
  // בריאות: לא POST ⇒ OK
  if (req.method !== 'POST') return res.status(200).send('OK');

  const token = process.env.TELEGRAM_TOKEN;
  const body = req.body || {};

  try {
    // 1) לחיצות על כפתורים
    if (body.callback_query) {
      const cq = body.callback_query;
      const chatId = cq.message?.chat?.id;
      const data = cq.data;
      let msg = '';

      if (data === 'lang_he') msg = '✅ שפה נקבעה לעברית.\nתקבל התראות בעברית.';
      if (data === 'lang_en') msg = '✅ Language set to English.\nYou will receive alerts in English.';

      if (msg && chatId) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: msg })
        });
      }
      return res.status(200).send('OK');
    }

    // 2) הודעות רגילות
    const msg = body.message;
    if (!msg) return res.status(200).send('OK');

    const chatId = msg.chat?.id;
    const text = (msg.text || '').trim();

    if (text === '/start' || text === 'start') {
      const reply = [
        '📡 ברוך הבא ל־TradeRadar',
        '',
        'בוט התראות על מניות (NASDAQ/NYSE) לפי טריגרים טכניים.',
        '⏰ דוח יומי ב־13:10 | ⚠️ לא ייעוץ השקעות.',
        '',
        'אנא בחר שפה:'
      ].join('\n');

      const keyboard = {
        inline_keyboard: [
          [
            { text: 'עברית 🇮🇱', callback_data: 'lang_he' },
            { text: 'English 🇬🇧', callback_data: 'lang_en' }
          ],
          [
            { text: '📢 הצטרף לערוץ', url: 'https://t.me/TradeRadarMFSignal' }
          ]
        ]
      };

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply, reply_markup: keyboard })
      });
    }

    return res.status(200).send('OK');
  } catch (e) {
    console.error('telegram handler error:', e);
    return res.status(200).send('OK');
  }
}

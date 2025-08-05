export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('OK');

  const token = process.env.TELEGRAM_TOKEN;
  const body = req.body;

  try {
    const chatId = body.message?.chat?.id;
    const text = body.message?.text?.trim();

    if (text === '/start') {
      const reply = [
        '📡 ברוך הבא ל־TradeRadar',
        '',
        'בוט התראות על מניות (NASDAQ/NYSE) לפי טריגרים טכניים.',
        '⏰ דוח יומי ב־13:10 | ⚠️ לא ייעוץ השקעות.',
        '',
        'אנא בחר שפה:',
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
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
          reply_markup: keyboard
        })
      });
    }

    if (body.callback_query) {
      const cq = body.callback_query;
      const data = cq.data;
      const chatId2 = cq.message.chat.id;

      let msg = '';
      if (data === 'lang_he') {
        msg = '✅ שפה נקבעה לעברית.\nתקבל התראות בעברית.';
      } else if (data === 'lang_en') {
        msg = '✅ Language set to English.\nYou will receive alerts in English.';
      }

      if (msg) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId2, text: msg })
        });
      }
    }

    return res.status(200).send('OK');
  } catch (e) {
    console.error(e);
    return res.status(200).send('OK');
  }
}

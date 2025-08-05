export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const token = process.env.TELEGRAM_TOKEN;
  const channel = '@TradeRadarMFSignal';

  const message = `
📊 *דוח יומי – TradeRadar*‏
🕐 ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}

🔔 טריגרים שאותרו:
• AAPL – Double Top
• TSLA – Hammer
• NVDA – Volume Spike

⚠️ שים לב! אין זו המלצת קנייה או מכירה.
  `.trim();

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channel,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    return res.status(200).json({ ok: true, sent: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}

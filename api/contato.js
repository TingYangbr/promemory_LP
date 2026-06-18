export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, empresa, tel, email, msg } = req.body;

  if (!nome || !empresa || !tel || !email) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'ProMemory Site <noreply@mymemory.com.br>',
      to: ['contato@mymemory.com.br'],
      reply_to: email,
      subject: `Novo contato pelo site — ${nome} (${empresa})`,
      html: `
        <h2>Novo contato pelo site ProMemory</h2>
        <table cellpadding="8" style="font-family: sans-serif; font-size: 15px;">
          <tr><td><strong>Nome</strong></td><td>${nome}</td></tr>
          <tr><td><strong>Empresa</strong></td><td>${empresa}</td></tr>
          <tr><td><strong>Telefone</strong></td><td>${tel}</td></tr>
          <tr><td><strong>E-mail</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td><strong>Mensagem</strong></td><td>${msg || '(não preenchida)'}</td></tr>
        </table>
      `
    })
  });

  if (response.ok) {
    return res.status(200).json({ ok: true });
  } else {
    const err = await response.json();
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Falha ao enviar e-mail' });
  }
}

type ContactPayload = {
  ad?: string
  email?: string
  telefon?: string
  konu?: string
  mesaj?: string
  recipientEmail?: string
  fromName?: string
  subjectPrefix?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(v: string): string {
  return v
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) return json(500, { error: 'Email service is not configured (RESEND_API_KEY missing).' })

  const fromEmail = process.env.CONTACT_FROM_EMAIL
  if (!fromEmail) return json(500, { error: 'CONTACT_FROM_EMAIL is missing.' })

  let body: ContactPayload
  try {
    body = (await req.json()) as ContactPayload
  } catch {
    return json(400, { error: 'Invalid JSON payload.' })
  }

  const ad = (body.ad ?? '').trim()
  const email = (body.email ?? '').trim()
  const mesaj = (body.mesaj ?? '').trim()
  const telefon = (body.telefon ?? '').trim()
  const konu = (body.konu ?? '').trim()
  const fromName = (body.fromName ?? '').trim() || 'Website Contact'
  const subjectPrefix = (body.subjectPrefix ?? '').trim() || 'Contact Form'
  const configuredTo = (process.env.CONTACT_TO_EMAIL ?? '').trim()
  const recipientEmail = configuredTo || (body.recipientEmail ?? '').trim()

  if (!ad) return json(400, { error: 'Ad Soyad zorunludur.' })
  if (!email || !EMAIL_RE.test(email)) return json(400, { error: 'Gecerli bir e-posta adresi girin.' })
  if (!mesaj || mesaj.length < 10) return json(400, { error: 'Mesaj en az 10 karakter olmalidir.' })
  if (!recipientEmail || !EMAIL_RE.test(recipientEmail)) {
    return json(400, { error: 'Alici e-posta ayari gecersiz.' })
  }

  const subject = `${subjectPrefix} - ${ad}`
  const html = `
    <h2>Yeni iletisim formu mesaji</h2>
    <p><strong>Ad Soyad:</strong> ${escapeHtml(ad)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(telefon || '-')}</p>
    <p><strong>Konu:</strong> ${escapeHtml(konu || '-')}</p>
    <p><strong>Mesaj:</strong></p>
    <p>${escapeHtml(mesaj).replaceAll('\n', '<br />')}</p>
  `

  const text = [
    'Yeni iletisim formu mesaji',
    `Ad Soyad: ${ad}`,
    `E-posta: ${email}`,
    `Telefon: ${telefon || '-'}`,
    `Konu: ${konu || '-'}`,
    '',
    'Mesaj:',
    mesaj,
  ].join('\n')

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [recipientEmail],
      reply_to: email,
      subject,
      html,
      text,
    }),
  })

  if (!resendRes.ok) {
    const errText = await resendRes.text()
    return json(502, { error: `Email provider error: ${errText}` })
  }

  return json(200, { ok: true })
}

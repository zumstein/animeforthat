export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }

    const formId = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID
    if (!formId || formId === 'PASTE_CONVERTKIT_FORM_ID_HERE') {
      // Not configured yet — silently succeed so the site still works
      return Response.json({ ok: true, note: 'ConvertKit not configured yet' })
    }

    const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: process.env.CONVERTKIT_API_KEY, email }),
    })

    if (!res.ok) throw new Error('ConvertKit error')
    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ ok: false, error: 'Subscribe failed' }, { status: 500 })
  }
}

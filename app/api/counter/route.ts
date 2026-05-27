export const runtime = 'edge'

export async function GET() {
  try {
    // @ts-ignore – KV binding injected by Cloudflare at runtime
    const kv = (globalThis as any).QUIZ_COUNTER
    if (!kv) return Response.json({ count: 0 })
    const raw = await kv.get('total')
    return Response.json({ count: parseInt(raw ?? '0', 10) })
  } catch {
    return Response.json({ count: 0 })
  }
}

export async function POST() {
  try {
    // @ts-ignore
    const kv = (globalThis as any).QUIZ_COUNTER
    if (!kv) return Response.json({ ok: true, count: 0 })
    const raw  = await kv.get('total')
    const next = (parseInt(raw ?? '0', 10)) + 1
    await kv.put('total', String(next))
    return Response.json({ ok: true, count: next })
  } catch {
    return Response.json({ ok: true, count: 0 })
  }
}

// app/api/check/route.ts
import { NextResponse } from 'next/server'
import { getWalletData, setWalletData } from '@/lib/kv'

export const runtime = 'edge'

export async function GET(req: Request) {
  const wallet = new URL(req.url).searchParams.get('wallet')?.toLowerCase()
  if (!wallet) return NextResponse.json({ error: 'wallet_required' }, { status: 400 })

  const cached = await getWalletData(wallet)
  if (cached) return NextResponse.json({ eligible: true, allocation: cached.allocation })

  const hash = [...wallet].reduce((a, c) => a + c.charCodeAt(0), 0) % 100
  if (hash >= 50) return NextResponse.json({ eligible: false })

  const allocation = (hash % (50000 - 50 + 1)) + 50
  await setWalletData(wallet, { allocation })
  return NextResponse.json({ eligible: true, allocation })
}

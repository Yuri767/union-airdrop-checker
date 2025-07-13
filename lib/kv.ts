// lib/kv.ts
import { kv } from '@vercel/kv'

export const getWalletData = async (wallet: string) =>
  (await kv.hgetall<Record<string, string>>(`w:${wallet.toLowerCase()}`)) || null

export const setWalletData = async (wallet: string, data: Record<string, any>) =>
  await kv.hset(`w:${wallet.toLowerCase()}`, data)

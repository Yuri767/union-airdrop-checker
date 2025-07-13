'use client'
import { useState } from 'react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [eligible, setEligible] = useState<boolean | null>(null)
  const [allocation, setAllocation] = useState<number | null>(null)
  const [error, setError] = useState('')

  const isValidEVM = (addr: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(addr)

  const handleCheck = async () => {
    setError('')
    setEligible(null)
    setAllocation(null)

    if (!isValidEVM(address)) {
      setError('Invalid EVM wallet address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/check?wallet=${address}`)
      const data = await res.json()
      setLoading(false)

      if (!data.eligible) {
        setEligible(false)
        return
      }

      setEligible(true)
      setAllocation(data.allocation)
    } catch (err) {
      setError('Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Union Airdrop Checker</h1>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your EVM wallet address"
        className="w-full max-w-md p-3 rounded-lg text-black placeholder-gray-600 mb-4"
      />

      <button
        onClick={handleCheck}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold"
      >
        {loading ? 'Checking...' : 'Check Allocation'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {eligible === true && (
        <p className="mt-6 text-green-400 text-xl font-medium">
          You are eligible! Your allocation is {allocation} $U tokens 🎉
        </p>
      )}

      {eligible === false && (
        <p className="mt-6 text-red-400 text-lg font-medium">
          Not eligible for the airdrop.
        </p>
      )}
    </main>
  )
}

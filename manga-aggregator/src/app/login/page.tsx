'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!login(email, password)) {
      setError('Email ou senha incorretos.')
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/10">
        <h1 className="text-3xl font-semibold mb-6">Entrar</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-neutral-300">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="text-sm text-neutral-300">Senha</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" required />
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        <p className="mt-6 text-sm text-neutral-400">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-primary hover:text-secondary transition-colors">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}

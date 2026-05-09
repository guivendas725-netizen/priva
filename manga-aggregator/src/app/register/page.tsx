'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (!register(name, email, password)) {
      setError('Já existe uma conta com este email.')
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/10">
        <h1 className="text-3xl font-semibold mb-6">Cadastrar</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-neutral-300">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required />
          </div>
          <div>
            <label className="text-sm text-neutral-300">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="text-sm text-neutral-300">Senha</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" required />
          </div>
          <div>
            <label className="text-sm text-neutral-300">Confirmar senha</label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="******" required />
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button type="submit" className="w-full">Cadastrar</Button>
        </form>
        <p className="mt-6 text-sm text-neutral-400">
          Já tem conta?{' '}
          <Link href="/login" className="text-primary hover:text-secondary transition-colors">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

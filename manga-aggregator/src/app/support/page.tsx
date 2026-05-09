'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const pixCode = '00020126580014br.gov.bcb.pix01369c78e0bd-6aee-4bfe-ad4c-a825f77be5435204000053039865802BR5925GUILHERME PONCIANO DE OLI6009Sao Paulo62290525REC69FF5BC747BE11414517656304B376'

export default function SupportPage() {
  const copyPix = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    await navigator.clipboard.writeText(pixCode)
    alert('Chave Pix copiada!')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Apoie o projeto</h1>
            <p className="mt-3 max-w-3xl text-neutral-300">Se quiser contribuir com qualquer valor, use o Pix abaixo. Seu apoio ajuda o site a continuar no ar.</p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground transition hover:bg-white/10">
            Voltar para o site
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">
            <h2 className="text-2xl font-semibold">Chave Pix</h2>
            <p className="mt-2 text-neutral-300">Olá, segue o código Pix Copia e Cola para pagamento. Obrigado!</p>
            <div className="mt-6 rounded-3xl border border-white/10 bg-background/80 p-5 font-mono text-sm text-neutral-100">
              {pixCode}
            </div>
            <Button onClick={copyPix} className="mt-6">Copiar chave Pix</Button>
          </div>

          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 text-center shadow-xl shadow-black/10">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 mb-4">QR Code de pagamento</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(pixCode)}`}
              alt="QR Code Pix de apoio"
              className="mx-auto h-auto w-full max-w-[420px] rounded-3xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

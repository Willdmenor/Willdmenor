'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const footerLinks = {
  shop: [
    { label: 'Novidades', href: '/novidades' },
    { label: 'Camisetas', href: '/camisetas' },
    { label: 'Moletons', href: '/moletons' },
    { label: 'Calcas', href: '/calcas' },
    { label: 'Acessorios', href: '/acessorios' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Trocas e Devolucoes', href: '/trocas' },
    { label: 'Rastrear Pedido', href: '/rastrear' },
    { label: 'Fale Conosco', href: '/contato' },
  ],
  about: [
    { label: 'Nossa Historia', href: '/sobre' },
    { label: 'Sustentabilidade', href: '/sustentabilidade' },
    { label: 'Trabalhe Conosco', href: '/carreiras' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="max-w-xl mx-auto text-center">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl lg:text-3xl font-light tracking-tight mb-3"
            >
              Fique por dentro
            </motion.h3>
            <p className="text-muted-foreground mb-6">
              Cadastre-se para receber novidades e ofertas exclusivas.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Seu e-mail"
                className="bg-background"
              />
              <Button type="submit">
                Inscrever
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 blur-md scale-110" />
                <div className="absolute inset-0 rounded-full bg-white/10 blur-lg scale-125" />
                <Image
                  src="/images/logo.png"
                  alt="CH Styles"
                  width={56}
                  height={56}
                  className="relative z-10 size-14 rounded-full"
                />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Streetwear premium para quem valoriza qualidade e estilo autentico.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="size-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="size-5" />
              </a>
              <a 
                href="mailto:contato@chstyle.com.br"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-medium mb-4">Loja</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-sm font-medium mb-4">Ajuda</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-sm font-medium mb-4">Sobre</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2024 CH Style. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/termos" className="hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="hover:text-foreground transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

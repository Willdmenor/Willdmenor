'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { CartSheet } from './cart-sheet'

const navLinks = [
  { href: '/colecao', label: 'Colecao' },
  { href: '/camisetas', label: 'Camisetas' },
  { href: '/moletons', label: 'Moletons' },
  { href: '/calcas', label: 'Calcas' },
  { href: '/acessorios', label: 'Acessorios' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openCart, getItemCount } = useCartStore()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>

            {/* Logo */}
            <Link 
              href="/" 
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 blur-md scale-110" />
                <div className="absolute inset-0 rounded-full bg-white/10 blur-lg scale-125" />
                <Image
                  src="/images/logo.png"
                  alt="CH Styles"
                  width={48}
                  height={48}
                  className="relative z-10 size-10 lg:size-12 rounded-full"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden lg:flex">
                <Search className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden lg:flex">
                <User className="size-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={openCart}
              >
                <ShoppingBag className="size-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 size-5 flex items-center justify-center bg-foreground text-background text-xs font-medium rounded-full"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 blur-md scale-110" />
                  <Image
                    src="/images/logo.png"
                    alt="CH Styles"
                    width={40}
                    height={40}
                    className="relative z-10 size-10 rounded-full"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
              
              <nav className="flex-1 flex flex-col justify-center px-8 gap-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-3xl font-light tracking-wide"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <CartSheet />
    </>
  )
}

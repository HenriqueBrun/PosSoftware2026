'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

interface SidebarProps {
  activePage?: string
}

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { label: 'Início', href: '/dashboard', icon: '🏠' },
    { label: 'Medicamentos', href: '/medicamentos', icon: '💊' },
    { label: 'Agenda', href: '/agenda', icon: '📅' },
    { label: 'Diário', href: '/diario', icon: '📓' },
    { label: 'Minha Conta', href: '/minha-conta', icon: '👤' },
  ]

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <span>💊</span>
        </div>
        <span className="logo-text">Pills</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <UserButton afterSignOutUrl="/" showName />
      </div>
    </aside>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Analyze", href: "/analyze" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ]

  return (
    <header className="bg-background border-b border-port-100 dark:border-port-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Logo />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-850 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 relative ${
                pathname === item.href 
                  ? "text-port-500 font-bold after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[3px] after:bg-port-500 after:rounded-full" 
                  : "text-gray-750 dark:text-gray-200 hover:text-port-500"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeToggle />
          <Button asChild className="bg-port-500 hover:bg-port-600 text-white font-medium shadow-sm">
            <Link href="/analyze">Try Argument Analysis</Link>
          </Button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="fixed inset-0 flex">
            <div className="relative flex w-full max-w-full flex-1 flex-col overflow-y-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-850 dark:text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          pathname === item.href 
                            ? "text-port-500 font-bold bg-port-50 dark:bg-port-900/20 border-l-4 border-port-500" 
                            : "text-gray-750 dark:text-gray-200 hover:text-port-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <Button asChild className="w-full bg-port-500 hover:bg-port-600 text-white font-medium shadow-sm">
                      <Link href="/analyze" onClick={() => setMobileMenuOpen(false)}>
                        Try Argument Analysis
                      </Link>
                    </Button>
                    <div className="mt-4 flex justify-center">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}


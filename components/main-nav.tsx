import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Home
      </Link>
      <Link
        href="/analyze"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/analyze" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Analyze
      </Link>
      <Link
        href="/pricing"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Pricing
      </Link>
      <Link
        href="/about"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/about" ? "text-primary" : "text-muted-foreground"
        )}
      >
        About
      </Link>
      <Link
        href="/blog"
        className={cn(
          "text-base font-medium transition-colors hover:text-primary",
          pathname === "/blog" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Blog
      </Link>
    </nav>
  )
} 
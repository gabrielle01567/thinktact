"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-port-300 dark:border-port-700 hover:bg-port-50 dark:hover:bg-port-900/50">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-port-500 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-port-300 dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-port-50 hover:text-port-500 text-gray-850">
                <Sun className="h-4 w-4 mr-2" /> Light Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-port-50 hover:text-port-500 text-gray-850">
                <Moon className="h-4 w-4 mr-2" /> Dark Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-port-50 hover:text-port-500 text-gray-850">
                <span className="h-4 w-4 mr-2 flex items-center justify-center">🖥️</span> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Light/Dark Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


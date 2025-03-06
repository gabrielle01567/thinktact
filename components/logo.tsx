import Link from "next/link"
import { Brain } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
      <span className="sr-only">ThinkTact</span>
      <Brain className="h-8 w-8 text-port-500" strokeWidth={1.5} />
      <h1 className="text-2xl font-bold text-port-500">ThinkTact</h1>
    </Link>
  )
}


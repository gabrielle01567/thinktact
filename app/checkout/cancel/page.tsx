import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your payment process was cancelled. No charges were made to your account. If you have any questions or need
            assistance, please contact our support team.
          </p>
          <div className="space-y-3 w-full">
            <Button asChild className="w-full">
              <Link href="/pricing">Return to Pricing</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


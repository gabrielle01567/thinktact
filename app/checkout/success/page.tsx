"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)
  const [customerEmail, setCustomerEmail] = useState("")

  useEffect(() => {
    async function getCheckoutSession() {
      if (!sessionId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/checkout/session?sessionId=${sessionId}`)
        const data = await response.json()

        if (response.ok && data.session) {
          setCustomerEmail(data.session.customer_details?.email || "")
        }
      } catch (error) {
        console.error("Error fetching checkout session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getCheckoutSession()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Processing your payment...</h1>
        <p className="text-gray-500 dark:text-gray-400">Please wait while we confirm your payment.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thank you for subscribing to ThinkTact. Your account has been activated.
            {customerEmail && (
              <>
                <br />
                We've sent a confirmation email to <strong>{customerEmail}</strong>.
              </>
            )}
          </p>
          <div className="space-y-3 w-full">
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
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


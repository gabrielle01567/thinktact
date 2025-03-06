"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { isValidPriceId } from "@/lib/stripe"

interface CheckoutButtonProps {
  priceId: string
  planName: string
  buttonText?: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
}

export function CheckoutButton({
  priceId,
  planName,
  buttonText = "Subscribe",
  variant = "default",
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    // Validate price ID format before making the API call
    if (!isValidPriceId(priceId)) {
      toast({
        title: "Invalid Price ID",
        description: `The price ID "${priceId}" appears to be invalid. Price IDs should start with "price_".`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get the current URL to use for success/cancel redirects
      const origin = window.location.origin
      const successUrl = `${origin}/checkout/success`
      const cancelUrl = `${origin}/checkout/cancel`

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planName,
          successUrl,
          cancelUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start checkout process. Please check your Stripe configuration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} variant={variant} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  )
}


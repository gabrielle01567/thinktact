"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { STRIPE_PRICE_IDS } from "@/lib/stripe"

export function StripeDebug() {
  const [showDebug, setShowDebug] = useState(false)

  const priceIds = {
    basic: STRIPE_PRICE_IDS.basic,
    professional: STRIPE_PRICE_IDS.professional,
    enterprise: STRIPE_PRICE_IDS.enterprise,
  }

  const isValidPriceId = (id: string) => {
    return id && id.startsWith("price_")
  }

  return (
    <div className="mt-8">
      <Button variant="outline" onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? "Hide" : "Show"} Stripe Configuration
      </Button>

      {showDebug && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Stripe Configuration</CardTitle>
            <CardDescription>
              This is a debug view to help you check your Stripe price IDs. Make sure all IDs start with "price_".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Basic Plan Price ID:</h3>
                <p className={`font-mono ${isValidPriceId(priceIds.basic) ? "text-green-500" : "text-red-500"}`}>
                  {priceIds.basic || "Not set"}
                </p>
                {!isValidPriceId(priceIds.basic) && (
                  <p className="text-sm text-red-500 mt-1">Invalid price ID. Should start with "price_"</p>
                )}
              </div>

              <div>
                <h3 className="font-medium">Professional Plan Price ID:</h3>
                <p className={`font-mono ${isValidPriceId(priceIds.professional) ? "text-green-500" : "text-red-500"}`}>
                  {priceIds.professional || "Not set"}
                </p>
                {!isValidPriceId(priceIds.professional) && (
                  <p className="text-sm text-red-500 mt-1">Invalid price ID. Should start with "price_"</p>
                )}
              </div>

              <div>
                <h3 className="font-medium">Enterprise Plan Price ID:</h3>
                <p className={`font-mono ${isValidPriceId(priceIds.enterprise) ? "text-green-500" : "text-red-500"}`}>
                  {priceIds.enterprise || "Not set"}
                </p>
                {!isValidPriceId(priceIds.enterprise) && (
                  <p className="text-sm text-red-500 mt-1">Invalid price ID. Should start with "price_"</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              To fix invalid price IDs, update your environment variables with the correct Stripe price IDs.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}


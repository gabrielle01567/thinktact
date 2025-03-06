import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutButton } from "@/components/checkout-button"
import { STRIPE_PRICE_IDS } from "@/lib/stripe"
import { StripeDebug } from "@/components/stripe-debug"

export default function PricingPage() {
  // Define fallback price IDs in case environment variables aren't set
  const fallbackPriceIds = {
    basic: "price_basic_placeholder",
    professional: "price_professional_placeholder",
    enterprise: "price_enterprise_placeholder",
  }

  // Use environment variables if available, otherwise use fallbacks
  const priceIds = {
    basic: STRIPE_PRICE_IDS.basic || fallbackPriceIds.basic,
    professional: STRIPE_PRICE_IDS.professional || fallbackPriceIds.professional,
    enterprise: STRIPE_PRICE_IDS.enterprise || fallbackPriceIds.enterprise,
  }

  const plans = [
    {
      name: "Basic",
      price: "$99",
      priceId: priceIds.basic,
      description: "Perfect for individual inventors and small businesses starting their patent journey.",
      features: [
        "AI-assisted patent drafting",
        "Basic prior art analysis",
        "Patent submission guidance",
        "Up to 3 patent applications/month",
        "Basic argument visualization tools",
        "Email support",
      ],
    },
    {
      name: "Professional",
      price: "$299",
      priceId: priceIds.professional,
      description: "Ideal for law firms and patent attorneys seeking comprehensive tools.",
      features: [
        "Everything in Basic",
        "Advanced prior art search",
        "Portfolio management tools",
        "Unlimited patent applications",
        "Advanced argument visualization",
        "Priority support",
        "Full ThinkTact Journal access",
        "API access (limited)",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceId: priceIds.enterprise,
      description: "For large organizations and IP-focused firms requiring full-scale solutions.",
      features: [
        "Everything in Professional",
        "Custom AI training",
        "Full API access",
        "Team collaboration tools",
        "Advanced analytics dashboard",
        "Dedicated account manager",
        "Custom integrations",
        "Early access to new features",
      ],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none gradient-text">
                Patent Assistance Plans
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Choose the plan that fits your patent needs. All plans include our AI-powered assistance tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col p-6 rounded-lg ${
                  plan.popular ? "border-2 border-primary relative shadow-lg" : "border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{plan.description}</p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-500">/month</span>}
                </div>
                <ul className="mb-6 space-y-2 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.name === "Enterprise" ? (
                  <Button asChild className="w-full">
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                ) : (
                  <CheckoutButton
                    priceId={plan.priceId}
                    planName={plan.name}
                    buttonText={`Get Started with ${plan.name}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Debug component for Stripe configuration */}
          <div className="flex justify-center mt-12">
            <StripeDebug />
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h4 className="font-bold mb-2">How does the patent assistance work?</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI-powered system enhances the patent process by providing intelligent assistance for drafting, prior art analysis, and submission, while preserving and amplifying human expertise in patent creation.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">What's included in ThinkTact Journal access?</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Professional and Enterprise plans include full access to our intellectual platform covering AI in law, patent strategies, argument visualization, and the future of legal innovation.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">How does argument visualization work?</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI-powered visualization tools help structure and present patent arguments more effectively, making complex technical and legal concepts clearer and more persuasive.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">What future features are planned?</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  We're expanding into comprehensive legal intelligence, including trademark assistance, corporate filings, and contract automation, all powered by our advanced AI technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                Ready to Transform Your Patent Process?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join the future of patent assistance and legal innovation with ThinkTact.
              </p>
            </div>
            <Button asChild size="lg" className="mt-6">
              <Link href="#pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


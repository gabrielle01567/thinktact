import { WaitlistForm } from "@/components/waitlist-form"

export default function WaitlistPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none gradient-text">
                Join the Waitlist
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Be the first to experience a new way of thinking—where argumentation meets innovation. Share your email
                and job title to join our waitlist.
              </p>
            </div>
            <div className="w-full max-w-md mt-8">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">Why Join the Waitlist?</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Here's what you'll get by signing up early.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Early Access</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Be among the first to experience ThinkTact when we launch.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Exclusive Discount</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Waitlist members will receive a special discount on our premium plans.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Product Updates</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Stay informed about our progress and be the first to know when we launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Have questions? We've got answers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-bold mb-2">When will ThinkTact launch?</h4>
              <p className="text-gray-500 dark:text-gray-400">
                We're currently in the final stages of development and plan to launch in Q3 2023.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">How will I know when I can access ThinkTact?</h4>
              <p className="text-gray-500 dark:text-gray-400">
                We'll send you an email with instructions on how to access the platform once it's available.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Is there a cost to join the waitlist?</h4>
              <p className="text-gray-500 dark:text-gray-400">
                No, joining the waitlist is completely free. You'll only pay when you decide to subscribe to one of our
                plans after launch.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Can I request specific features?</h4>
              <p className="text-gray-500 dark:text-gray-400">
                We love hearing from our community. After joining the waitlist, you'll have opportunities to provide
                feedback and feature requests.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


import { Brain, CheckCircle, FileText, Lightbulb, MessageSquare, Scale, Search, Shield, Zap, Book, Target, FileCheck, Database, Workflow } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "AI-Assisted Patent Drafting",
      description:
        "Streamline your patent drafting process with AI assistance that enhances efficiency while maintaining the crucial human element.",
    },
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Prior Art Analysis",
      description:
        "Comprehensive assessment of novelty and usefulness through advanced AI technology and extensive patent database search.",
    },
    {
      icon: <FileCheck className="h-10 w-10 text-primary" />,
      title: "Submission Support",
      description:
        "Streamlined patent submission process with automated checks and guidance to reduce friction and accelerate approval.",
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Patent Portfolio Management",
      description:
        "Efficiently manage and monitor your patent portfolio with AI-powered tools for tracking and analysis.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Argument Visualization",
      description:
        "Advanced visualization tools to help structure and present patent claims with clarity and precision.",
    },
    {
      icon: <Workflow className="h-10 w-10 text-primary" />,
      title: "Integration & Workflow",
      description:
        "Seamless integration with existing patent management systems and professional workflows.",
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
                Professional Patent Assistance Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover how ThinkTact's AI-powered platform revolutionizes the patent process while preserving the essential human expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 flex-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                Future Capabilities
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Our roadmap for expanding ThinkTact's capabilities
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Legal Intelligence Platform</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>AI-driven legal research tools</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Automated contract drafting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Document automation systems</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Advanced IP Management</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Infringement detection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Portfolio analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Strategic IP insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
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
              <Link href="/waitlist">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


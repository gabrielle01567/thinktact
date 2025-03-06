import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Shield, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none gradient-text">
                Why ThinkTact Exists
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                A personal message from our founder on the vision behind ThinkTact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Message Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="max-w-[800px] mx-auto space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              I built ThinkTact because I saw a problem no one was solving. Even the smartest people struggle to construct airtight arguments—not because they lack ideas, but because the tools for analyzing and structuring reasoning are outdated and ineffective.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              I wanted something better. Something that didn't just check grammar or summarize points but actually understood logic, structure, and persuasion. So I created ThinkTact—a system designed to break down arguments, identify weaknesses, and strengthen reasoning at its core.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              This isn't just about writing better. It's about thinking better. Whether you're drafting a patent, building a legal case, or making a high-stakes business decision, the ability to construct a precise, unshakable argument is power.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-semibold">
              ThinkTact is here to put that power in your hands.
            </p>
            <div className="pt-4">
              <p className="text-gray-500 italic">- Gabrielle T. Shand, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
              <div className="p-3 rounded-full bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Think Better</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Our AI-powered system helps you structure thoughts and arguments with unprecedented clarity and precision.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Build Stronger</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Identify and eliminate weaknesses in your reasoning to create unshakable arguments.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
              <div className="p-3 rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Move Faster</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Transform your workflow with tools that enhance both speed and quality of thought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">Our Team</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Meet the experts behind ThinkTact.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Gabrielle T. Shand",
                role: "Founder & CEO",
                bio: "Visionary founder with expertise in AI and computational linguistics, dedicated to transforming how we think and argue through innovative technology.",
              },
              {
                name: "Avery Butler",
                role: "Chief Financial Officer & Strategic Advisor",
                bio: "Financial Advisor at Merrill Lynch, Wharton School graduate, and owner of EmbryCare. Oversees financial planning, budgeting, and capital raising strategies while guiding business development.",
              },
              {
                name: "Wyatt Susich",
                role: "Salesforce and CRM Strategy Lead",
                bio: "Senior Salesforce Consultant with extensive experience in CRM platforms and implementations. Leads the integration of ThinkTact AI with Salesforce and other CRM platforms.",
              },
            ].map((member, index) => (
              <div key={index} className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 mx-auto"></div>
                <h3 className="text-xl font-bold text-center">{member.name}</h3>
                <p className="text-primary font-medium mb-2 text-center">{member.role}</p>
                <p className="text-gray-500 dark:text-gray-400 text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                Ready to Think Better?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join us in revolutionizing how arguments are constructed and analyzed.
              </p>
            </div>
            <Button asChild size="lg" className="mt-6">
              <Link href="/waitlist">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


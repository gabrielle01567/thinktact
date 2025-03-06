"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [job, setJob] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, job }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit. Please try again.")
      }

      toast({
        title: "Success!",
        description: data.message || "You've been added to our waitlist. We'll be in touch soon!",
      })

      // Reset form fields on success
      setEmail("")
      setJob("")
    } catch (err) {
      console.error("Form submission error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again later."

      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="job">Job Title</Label>
        <Input
          id="job"
          type="text"
          placeholder="Enter your job title"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />
      </div>
      {error && (
        <div className="text-sm text-red-500 p-2 border border-red-200 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Join Waitlist"}
      </Button>
    </form>
  )
}


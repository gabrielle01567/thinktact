import { NextResponse } from "next/server"

// Replace this with your actual AWS API Gateway endpoint
const AWS_API_ENDPOINT = process.env.AWS_API_ENDPOINT || "https://your-api-gateway-endpoint.amazonaws.com/prod/submit"

// Set to true to use mock response during development
const USE_MOCK_RESPONSE = false

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, job } = body

    // Validate the input
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Log the submission data (for debugging)
    console.log("Form submission:", { email, job })

    // Use mock response if enabled
    if (USE_MOCK_RESPONSE) {
      console.log("Using mock response (AWS endpoint not called)")

      // Simulate a delay to mimic API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        success: true,
        message: "Your information has been submitted successfully! (Mock Response)",
        data: { email, job, timestamp: new Date().toISOString() },
      })
    }

    // Attempt to forward the request to AWS API Gateway with error handling
    try {
      const response = await fetch(AWS_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, industry: job }),
      })

      // Check if the AWS request was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("AWS API Gateway error:", errorData || response.statusText)

        return NextResponse.json(
          { 
            success: false, 
            message: "Failed to submit. Please make sure both email and industry/job title are provided and valid.",
            error: errorData?.message || "Unknown error"
          },
          { status: 500 },
        )
      }

      // Return success response
      const data = await response.json()
      console.log("AWS API Response:", data)
      return NextResponse.json({
        success: true,
        message: "Your information has been submitted successfully!",
        data,
      })
    } catch (fetchError) {
      console.error("AWS API Gateway fetch error:", fetchError)

      return NextResponse.json(
        {
          success: false,
          message: "Unable to connect to our submission service. Please try again later.",
          error: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}


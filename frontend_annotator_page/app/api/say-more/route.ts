/**
 * SAY MORE API ROUTE
 *
 * This route handles requests for more detailed annotations.
 *
 * Flow:
 * Frontend sends POST request to /api/say-more with:
 * - functionName: The name of the function
 * - currentAnnotation: The existing annotation
 *
 * This route calls your backend to generate more detailed explanation
 * Returns { detailedAnnotation: string }
 *
 * IMPORTANT: You'll need to modify this to connect to your actual backend
 */

export async function POST(request: Request) {
  try {
    const { functionName, currentAnnotation } = await request.json()

    if (!functionName) {
      return Response.json({ error: "No function name provided" }, { status: 400 })
    }

    // TODO: Replace this with your actual backend call
    // Example: const response = await fetch('http://your-backend:8000/say-more', { ... })

    // For now, return mock detailed annotation (replace with real backend)
    const mockDetailedAnnotations: Record<string, string> = {
      calculateSum:
        "This function takes two parameters: a (number) and b (number). It adds them using the + operator and returns the result. Used for basic arithmetic operations. Time complexity: O(1). No side effects.",
      getUserData:
        "Queries the database with an async call. Uses prepared statements to prevent SQL injection. Includes error handling for network failures. Returns null if user not found. Caches results for 5 minutes.",
      validateEmail:
        "Uses RFC 5322 regex pattern for email validation. Checks for valid characters, @ symbol, domain, and TLD. Returns boolean. Note: Should also use server-side validation in production.",
    }

    const detailedAnnotation =
      mockDetailedAnnotations[functionName] || `No additional details available for ${functionName}.`

    return Response.json({ detailedAnnotation })
  } catch (error) {
    console.error("Error in say-more route:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

"use server"

import { revalidatePath } from "next/cache"

// Type for our call object
type CallObject = {
  prompt: string
  first_message: string
  number: string
}

// Store the latest call object
let latestCallObject: CallObject | null = null

// Get the latest call object
export function getLatestCallObject() {
  return latestCallObject
}

// Create a new call object
export async function createCall(formData: FormData) {
  // Extract form data
  const prompt = formData.get("prompt") as string
  const firstMessage = formData.get("first_message") as string
  const number = formData.get("number") as string

  // Basic validation
  if (!prompt || !firstMessage || !number) {
    throw new Error("All fields are required")
  }

  if (!/^\d{10}$/.test(number)) {
    throw new Error("Please enter a valid 10-digit phone number")
  }

  // Create the call object
  latestCallObject = {
    prompt,
    first_message: firstMessage,
    number,
  }

  // Revalidate the page to show the new data
  revalidatePath("/call")

  return latestCallObject
}


import type { ContactFormValues } from "./validations";

export type ContactSubmission = ContactFormValues;

export type ContactApiResponse = {
  success: boolean;
  id?: string;
  error?: string;
};

export async function submitToGoogleSheets(
  data: ContactSubmission,
): Promise<ContactApiResponse> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    throw new Error("GOOGLE_SCRIPT_URL is not configured.");
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: data.type,
      company: data.company ?? "",
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      message: data.message,
      privacy: data.privacy ? "YES" : "NO",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to submit inquiry.");
  }

  const result = (await response.json()) as ContactApiResponse;

  if (!result.success) {
    throw new Error(result.error ?? "Failed to submit inquiry.");
  }

  return result;
}

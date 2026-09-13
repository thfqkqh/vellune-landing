import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { createInquiry } from "@/lib/inquiries";
import { sendInquiryNotificationEmail } from "@/lib/email";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid form data.",
        },
        { status: 400 },
      );
    }

    const { inquiry, displayId } = await createInquiry(parsed.data);

    let emailSent = false;
    let emailError: string | undefined;

    try {
      await sendInquiryNotificationEmail(inquiry);
      emailSent = true;
    } catch (error) {
      emailError =
        error instanceof Error ? error.message : "Failed to send notification email.";
    }

    return NextResponse.json({
      success: true,
      id: displayId,
      emailSent,
      emailError,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit inquiry.",
      },
      { status: 500 },
    );
  }
}

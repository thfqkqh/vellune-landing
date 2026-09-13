import type { ContactFormValues } from "./validations";
import { createSupabaseAdmin, type InquiryRow } from "./supabase/admin";

export type ContactApiResponse = {
  success: boolean;
  id?: string;
  emailSent?: boolean;
  emailError?: string;
  error?: string;
};

export async function createInquiry(
  data: ContactFormValues,
): Promise<{ inquiry: InquiryRow; displayId: string }> {
  const supabase = createSupabaseAdmin();

  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .insert({
      type: data.type,
      company: data.company ?? "",
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      message: data.message,
      privacy: data.privacy,
      status: "NEW",
      notes: "",
    })
    .select()
    .single();

  if (error || !inquiry) {
    throw new Error(error?.message ?? "Failed to create inquiry.");
  }

  return {
    inquiry: inquiry as InquiryRow,
    displayId: inquiry.display_id,
  };
}

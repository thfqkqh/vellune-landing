import { z } from "zod";

export const contactFormSchema = z.object({
  type: z.enum(["GENERAL", "BUSINESS", "PARTNERSHIP", "DISTRIBUTION"], {
    message: "문의 유형을 선택해주세요.",
  }),
  company: z.string().optional(),
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
  phone: z.string().optional(),
  message: z.string().min(1, "문의 내용을 입력해주세요."),
  privacy: z.literal(true, {
    message: "개인정보 수집 및 이용에 동의해주세요.",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

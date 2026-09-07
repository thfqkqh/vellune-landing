export const navLinks = [
  { label: "ABOUT", href: "#company" },
  { label: "PRODUCT", href: "#product" },
  { label: "CONTACT", href: "#contact" },
] as const;

export const heroContent = {
  headline: ["YOUR SKIN.", "IN ITS OWN", "RHYTHM."],
  subheadline:
    "Skincare designed around the natural rhythm of your skin.",
  subheadlineKo: "피부가 가장 편안한 순간을 연구합니다.",
};

export const brandContent = {
  headline: [
    "YOUR SKIN",
    "CHANGES.",
    "EVERY DAY.",
    "",
    "SO SHOULD",
    "THE WAY",
    "WE CARE FOR IT.",
  ],
  description:
    "피부는 매일 변화합니다. VELLUNE은 피부의 자연스러운 리듬을 이해하는 것에서 시작합니다.",
};

export const companyContent = {
  label: "VELLUNE LABS",
  headline: ["WE STUDY", "THE WAY", "SKIN CHANGES."],
  description:
    "VELLUNE LABS는 피부의 변화와 균형을 연구합니다. 우리는 피부에 필요한 것을 단순히 더하는 것이 아니라, 피부가 스스로 편안한 상태를 유지할 수 있도록 돕는 스킨케어를 만듭니다.",
  keywords: [
    {
      id: "understand",
      title: "UNDERSTAND",
      description: "먼저 피부를 이해합니다.",
    },
    {
      id: "balance",
      title: "BALANCE",
      description: "피부의 균형을 생각합니다.",
    },
    {
      id: "recover",
      title: "RECOVER",
      description: "회복을 돕습니다.",
    },
  ],
};

export const visualContent = {
  headline: "VELLUNE IN MOTION",
  subheadline: "Quiet premium skincare, in motion.",
};

export const contactContent = {
  headline: ["LET'S", "CREATE", "SOMETHING", "TOGETHER."],
  description:
    "VELLUNE과 함께 새로운 가능성을 만들어보세요.",
  successTitle: "THANK YOU.",
  successMessage:
    "Your inquiry has been received. We'll get back to you soon.",
};

export const inquiryTypes = [
  { value: "GENERAL", label: "GENERAL" },
  { value: "BUSINESS", label: "BUSINESS" },
  { value: "PARTNERSHIP", label: "PARTNERSHIP" },
  { value: "DISTRIBUTION", label: "DISTRIBUTION" },
] as const;

export const privacyPolicy = {
  title: "개인정보 처리방침",
  sections: [
    {
      title: "수집 항목",
      body: "회사명, 이름, 이메일, 연락처, 문의 내용",
    },
    {
      title: "수집 목적",
      body: "문의 접수 및 고객 응대",
    },
    {
      title: "보유 기간",
      body: "문의 처리 완료 후 1년",
    },
    {
      title: "문의",
      body: "hello@vellune.com",
    },
  ],
};

export const footerContent = {
  company: "VELLUNE LABS",
  email: "hello@vellune.com",
  instagram: "https://instagram.com/vellune",
  copyright: "© VELLUNE LABS",
};

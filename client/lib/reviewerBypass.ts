export const REVIEWER_ACCOUNT_EMAILS = [
  "apple-review@wildergo.com",
  "apple@wildergo.com",
] as const;

type ReviewerBypassEmail = (typeof REVIEWER_ACCOUNT_EMAILS)[number];

export function isReviewerBypassEmail(email: string) {
  return REVIEWER_ACCOUNT_EMAILS.includes(
    email.toLowerCase().trim() as ReviewerBypassEmail,
  );
}

export const REVIEWER_ACCOUNT_EMAIL = "apple-review@wildergo.com";
export const REVIEWER_ACCOUNT_PASSWORD = "WilderGoReview2026!";

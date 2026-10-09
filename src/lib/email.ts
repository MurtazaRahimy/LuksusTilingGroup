import { Resend } from "resend";
import { business } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type EnquiryNotification = {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  jobType: string;
  description: string;
};

export async function notifyNewEnquiry(enquiry: EnquiryNotification): Promise<void> {
  // No API key configured (e.g. local dev) — skip silently, enquiry is already saved in the database.
  if (!resend) return;

  try {
    await resend.emails.send({
      from: `${business.name} Website <onboarding@resend.dev>`,
      to: business.email,
      replyTo: enquiry.email,
      subject: `New enquiry: ${enquiry.jobType} in ${enquiry.suburb}`,
      text: [
        `New enquiry from the website:`,
        ``,
        `Name: ${enquiry.name}`,
        `Phone: ${enquiry.phone}`,
        `Email: ${enquiry.email}`,
        `Suburb: ${enquiry.suburb}`,
        `Job type: ${enquiry.jobType}`,
        ``,
        `Description:`,
        enquiry.description,
        ``,
        `View full details (and any attached photo) in the admin area under Enquiries.`,
      ].join("\n"),
    });
  } catch (error) {
    // Never let an email failure block the enquiry from being saved — it's
    // already in the database and visible in /admin/enquiries regardless.
    console.error("Failed to send enquiry notification email:", error);
  }
}

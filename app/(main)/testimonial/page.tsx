import TestimonialOptionPage from "@/components/testimonial-option-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonial - KudosFlow",
};
export default function TestimonialPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Get Started with Testimonials!
      </h1>
      <TestimonialOptionPage />
    </div>
  );
}

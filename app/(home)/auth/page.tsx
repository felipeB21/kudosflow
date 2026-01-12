import AuthFormDemo from "@/components/auth-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Auth - KudosFlow",
};

export default function AuthPage() {
  return (
    <Suspense>
      <AuthFormDemo />
    </Suspense>
  );
}

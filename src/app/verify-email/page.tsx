import { VerifyEmailForm } from "@/components/verify-email-form";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}

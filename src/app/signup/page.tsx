import { SignUpForm } from "@/components/signup-form";
import { departments } from "@/lib/data";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
       <div className="w-full max-w-md">
        <SignUpForm departments={departments} />
      </div>
    </div>
  );
}

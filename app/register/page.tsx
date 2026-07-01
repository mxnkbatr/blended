import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Бүртгүүлэх",
};

export default function RegisterPage() {
  return <LoginForm defaultMode="signup" />;
}

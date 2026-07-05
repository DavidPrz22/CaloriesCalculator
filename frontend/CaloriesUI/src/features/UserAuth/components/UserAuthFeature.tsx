import { useLocation } from "react-router";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export function UserAuthFeature() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  return (
    <div className="flex items-center justify-center">
      {isSignup ? <SignupForm /> : <LoginForm />}
    </div>
  );
}

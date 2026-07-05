import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { Leaf } from "lucide-react";
import { useSignupMutation } from "../hooks/mutations/mutations";
import { UserAuthSchema, type UserAuthSchemaType } from "../schemas/schemas";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignupForm() {
  const { t } = useI18n();
  const signup = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserAuthSchemaType>({
    resolver: zodResolver(UserAuthSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: UserAuthSchemaType) => {
    signup.mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-xl gradient-leaf text-primary-foreground">
          <Leaf className="h-6 w-6" />
        </div>
        <CardTitle className="font-display text-2xl">{t("signup")}</CardTitle>
        <CardDescription>{t("signupDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input id="username" {...register("username")} autoComplete="username" />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" {...register("password")} autoComplete="new-password" />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("signingUp") : t("signup")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            {t("login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useLoginMutation } from "../hooks/mutations/mutations";
import { UserAuthSchema, type UserAuthSchemaType } from "../schemas/schemas";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

const DEMO_CREDENTIALS = {
  username: "demo@caloriestracker.com",
  password: "demo1234",
};

export function LoginForm() {
  const { t } = useI18n();
  const login = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserAuthSchemaType>({
    resolver: zodResolver(UserAuthSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: UserAuthSchemaType) => {
    login.mutate(data);
  };

  const handleDemoLogin = () => {
    setValue("username", DEMO_CREDENTIALS.username);
    setValue("password", DEMO_CREDENTIALS.password);
    handleSubmit(onSubmit)();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center py-8">
        <CardTitle className="font-display text-2xl">{t("login")}</CardTitle>
        <CardDescription>{t("loginDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input id="username" {...register("username")} autoComplete="username" />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" {...register("password")} autoComplete="current-password" />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
            {isSubmitting ? t("loggingIn") : t("login")}
          </Button>
        </form>
        <div className="mt-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Demo Account</span>
          </div>
          <div className="mb-3 space-y-1 text-xs text-muted-foreground">
            <p><span className="font-medium">Username:</span> {DEMO_CREDENTIALS.username}</p>
            <p><span className="font-medium">Password:</span> {DEMO_CREDENTIALS.password}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDemoLogin}
            disabled={isSubmitting}
          >
            <Zap className="mr-2 h-4 w-4" />
            Try Demo
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            {t("signup")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

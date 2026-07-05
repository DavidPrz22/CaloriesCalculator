import { Link, NavLink } from "react-router";
import { Menu, Leaf, Languages, Search, Database, Utensils, LogIn, LogOut, User } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/features/UserAuth";
import { useLogoutMutation } from "@/features/UserAuth/hooks/mutations/mutations";

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const { data: user } = useProfile();

  const logoutMutation = useLogoutMutation();
  
  const handleLogout = async () => {
      await logoutMutation.mutateAsync();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background bg-grain">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-leaf text-primary-foreground shadow-sm transition-transform group-hover:rotate-6">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold text-foreground">
              {t("appName")}
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2" >
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    {user.username}
                  </span>
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="mr-1.5 h-4 w-4" />
                    {t("login")}
                  </Link>
                </Button>
              )}
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("menu")}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl">{t("menu")}</SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-6 px-4">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Languages className="h-3.5 w-3.5" /> {t("language")}
                    </p>
                    <div className="flex overflow-hidden rounded-full border border-border bg-muted p-1">
                      <button
                        onClick={() => setLang("en")}
                        className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setLang("es")}
                        className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          lang === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        ES
                      </button>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-1">
                    <NavItem to="/" icon={<Search className="h-4 w-4" />} label={t("home")} onClick={() => setOpen(false)} />
                    <NavItem to="/consumption" icon={<Utensils className="h-4 w-4" />} label={t("consumption")} onClick={() => setOpen(false)} />
                    <NavItem to="/foods" icon={<Database className="h-4 w-4" />} label={t("foodsDb")} onClick={() => setOpen(false)} />
                  </nav>

                  <div className="border-t border-border pt-4">
                    {user ? (
                      <button
                        onClick={() => { setOpen(false); handleLogout(); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("logout")}
                      </button>
                    ) : (
                      <NavItem to="/login" icon={<LogIn className="h-4 w-4" />} label={t("login")} onClick={() => setOpen(false)} />
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl m-auto px-4 py-8 sm:py-12">{children}</main>
    </div>
  );
}

function NavItem({ to, icon, label, onClick }: { to: string; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={true}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-accent ${
          isActive ? "bg-accent text-accent-foreground" : "text-foreground"
        }`
      }
    >
      <span className="text-primary">{icon}</span>
      {label}
    </NavLink>
  );
}

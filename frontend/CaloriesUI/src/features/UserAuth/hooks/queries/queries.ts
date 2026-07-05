import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "./queryoptions";
import { useAuthStore } from "../../store/authStore";

export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    ...profileQueryOptions(),
    enabled: isAuthenticated,
  });
}

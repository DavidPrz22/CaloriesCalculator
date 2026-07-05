import { getProfile } from "../../api/api";

export const USER_AUTH_KEY = "user-auth";

export function profileQueryOptions() {
  return {
    queryKey: [USER_AUTH_KEY, "profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: Infinity,
  };
}

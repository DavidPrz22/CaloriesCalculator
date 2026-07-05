import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import { signup, login, logout, refreshProfile } from "../../api/api";
import { USER_AUTH_KEY } from "../queries/queryoptions";
import type { UserAuthSchemaType } from "../../schemas/schemas";
import type { LogoutResponse } from "../../types/types";

export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: UserAuthSchemaType) => {
      return await login(data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [USER_AUTH_KEY] });
      setAuth(response.user, response.accessToken);
      toast.success(response.message || "Login successful!");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useSignupMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
   // Assuming signup uses the same login function for simplicity
  return useMutation({
    mutationFn: async (data: UserAuthSchemaType) => await signup(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [USER_AUTH_KEY] });
      setAuth(response.user, response.accessToken);
      toast.success(response.message || "Signup successful!");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogoutMutation () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => await logout(),
    onSuccess: (response: LogoutResponse) => {
      clearAuth();
      toast.success(response.message || "Logout successful!");
      queryClient.removeQueries({ queryKey: [USER_AUTH_KEY] });
      navigate("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}


export const useRefreshProfileMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await refreshProfile(),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.invalidateQueries({ queryKey: [USER_AUTH_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to refresh token.");
      clearAuth();
    },
  });
};

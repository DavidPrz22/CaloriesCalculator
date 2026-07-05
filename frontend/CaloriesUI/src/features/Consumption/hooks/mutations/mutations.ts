import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConsumption } from "../../api/api";
import {CONSUMPTION_DETAIL_KEY, CONSUMPTION_KEY } from "../queries/queryoptions";
import { useHistoryStore } from "@/ZustandStores/useHistoryStore";
import { toast } from "sonner";

export function useDeleteConsumption() {
  const queryClient = useQueryClient();
  const removeRecord = useHistoryStore((s) => s.removeRecord);

  return useMutation<void, Error, number>({
    mutationFn: deleteConsumption,
    onSuccess: (_, id) => {
      removeRecord(id);
      queryClient.invalidateQueries({ queryKey: [CONSUMPTION_DETAIL_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONSUMPTION_KEY] });
      toast.success("Consumption record deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete consumption record");
    },
  });
}

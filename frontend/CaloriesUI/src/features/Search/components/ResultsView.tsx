import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { usePlateStore } from "@/ZustandStores";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsTable } from "./ResultsTable";
import { ResultsAction } from "./ResultsAction";
import { useSaveConsumption } from "../hooks/mutations/mutation";
import { useSearchParams } from "react-router";
import type { resultsParams } from '../types/types'
import { useCalculateNutrition } from '../hooks/mutations/mutation'
import type { FoodArg } from "./../schemas/schemas";

export function ResultsView() {
  const nutritionResult = usePlateStore((s) => s.nutritionResult);
  const saveConsumption = useSaveConsumption();
  const { mutate: calculate } = useCalculateNutrition();
  const  [searchParams] = useSearchParams();

  const queryParams : resultsParams = {
    id : searchParams.getAll("id"),
    qty : searchParams.getAll("qty")
  }

  const getItemsFromQuery = (params: resultsParams): FoodArg[] => {
    const ids = params.id || [];
    const qty = params.qty || [];

    const foodargs: FoodArg[] = ids.map((fdcIdStr, idx) => {
      return {
        fdcId: Number(fdcIdStr),
        amount: Number(qty[idx] || 100),
      };
    });

    return foodargs;
  };

  useEffect(() => {
    if (queryParams.id?.length !== 0) {
      const items = getItemsFromQuery(queryParams);
      calculate(items);
    }
  }, [searchParams]); // Reacting to URL params changing


  const items = nutritionResult?.items || [];
  const totals = nutritionResult?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const onSave = () => {
    if (items.length === 0) return;
    saveConsumption.mutate({ totals, items });
  };

  return (
    <AppShell>
        <ResultsHeader itemsCount={items.length} />
        <ResultsTable items={items} totals={totals} />
        <ResultsAction onSave={onSave} disabled={items.length === 0 || saveConsumption.isPending} />
    </AppShell>
  );
}

import { useState } from "react";
import { toast } from "sonner";
import { usePlateStore } from "@/ZustandStores";
import { useI18n } from "@/lib/i18n";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchFood, useUnits } from "../hooks/queries/queries";
import { useCalculateNutrition } from "../hooks/mutations/mutation";
import { toBackendLang } from "../types/types";
import { SearchHeader } from "./SearchHeader";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { PlateSection } from "./PlateSection";
import type { FoodArg } from "./../schemas/schemas";
import {useNavigate } from "react-router";


export function SearchFeature() {
  const { t, lang } = useI18n();
  const plate = usePlateStore((s) => s.plate);
  const plateEntries = Object.values(plate);
  const { mutate: calculateNutrition} = useCalculateNutrition();

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("1");

  const debouncedQuery = useDebounce(query, 300);
  const categoriaId = Number(categoryId);
  const navegate = useNavigate();

  const { data: results = [] } = useSearchFood(
    debouncedQuery,
    categoriaId,
    toBackendLang(lang)
  );

  const { data: units = [] } = useUnits();

  const onCalculate = () => {
    if (plateEntries.length === 0) {
      toast.error(t("selectFirst"));
      return;
    }
    const invalid = plateEntries.find((p) => !Number.isFinite(p.amount) || p.amount <= 0);
    if (invalid) {
      toast.error(t("invalidAmount"));
      return;
    }
    const items: FoodArg[] = Object.entries(plate).map(([fdcIdStr, entry]) => ({
            fdcId: Number(fdcIdStr),
            amount: entry.amount,
    }));
    calculateNutrition(items, { 
        onSuccess: () => navegate('/results')
      });
  };

  return (
    <div>
      <SearchHeader />
      <div className="rounded-2xl border border-border bg-card p-2 shadow-sm">
        <SearchInput
          query={query}
          setQuery={setQuery}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
        />
        <SearchResults query={debouncedQuery} results={results} units={units} />
      </div>
      <PlateSection onCalculate={onCalculate} />
    </div>
  );
}

import { useState } from 'react';
import { useComidas, useDeleteComida } from '../hooks/queries/queries';
import { FoodRecordsTable } from './FoodRecordsTable';
import { FoodRecordForm } from './FoodRecordForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Database, Plus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { Comida } from '../types';
import { AppShell } from '@/components/AppShell';
import { useProfile } from "@/features/UserAuth";

export function FoodRecordsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Comida | null>(null);
    const { data: user } = useProfile();

  const { data, isLoading } = useComidas(page, 50, search);
  const deleteMutation = useDeleteComida();

  const handleEdit = (comida: Comida) => {
    setEditingRecord(comida);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-primary">
            <Database className="h-5 w-5" />
          </span>
          <div className='flex flex-col gap-1'>
            <div className="font-display text-3xl mb-0 font-semibold sm:text-5xl">{t("foodsDb") || "Food Records"}</div>
            <p className="text-md text-muted-foreground self-start">
              {data?.total || 0} {t("items") || "items"}
            </p>
          </div>

        </div>
        {user && (
          <Button size='lg' onClick={() => setIsFormOpen(true)} className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            {t("create") || "Create New"}
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder={t("searchPlaceholder") || "Search..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-11 max-w-lg"
        />
      </div>

      <FoodRecordsTable
        data={data?.items || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />

      {isFormOpen && (
        <FoodRecordForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          initialData={editingRecord}
        />
      )}
    </AppShell>
  );
}

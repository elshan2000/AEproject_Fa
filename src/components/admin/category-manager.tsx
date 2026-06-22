"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/category";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shop/empty-state";
import { toPersianDigits } from "@/lib/utils";
import type { CategoryWithCount } from "@/types";

export function CategoryManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  function refresh() {
    router.refresh();
  }

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      const result = await createCategoryAction({ name });
      if (result.success) {
        toast({ title: "دسته‌بندی اضافه شد" });
        setNewName("");
        refresh();
      } else {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
      }
    });
  }

  function handleRename(id: string) {
    const name = editName.trim();
    if (!name) return;
    startTransition(async () => {
      const result = await updateCategoryAction(id, { name });
      if (result.success) {
        toast({ title: "دسته‌بندی به‌روزرسانی شد" });
        setEditingId(null);
        refresh();
      } else {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (result.success) {
        toast({ title: "دسته‌بندی حذف شد" });
        refresh();
      } else {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add form */}
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="نام دسته‌بندی جدید"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button onClick={handleAdd} disabled={pending || !newName.trim()}>
          <Plus className="h-4 w-4" /> افزودن
        </Button>
      </div>

      {/* List */}
      {categories.length === 0 ? (
        <EmptyState
          title="هنوز دسته‌بندی ندارید"
          description="برای سازماندهی محصولات، یک دسته‌بندی اضافه کنید."
        />
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg border bg-card">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-3 p-4">
              {editingId === c.id ? (
                <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleRename(c.id);
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRename(c.id)}
                    disabled={pending}
                    aria-label="ذخیره"
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                    aria-label="انصراف"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {toPersianDigits(c.productCount)} محصول
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                    aria-label="ویرایش"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(c.id)}
                    disabled={pending}
                    aria-label="حذف"
                  >
                    {pending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

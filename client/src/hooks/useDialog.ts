import { useState } from "react";

type DialogMode = "create" | "edit" | "closed";
interface DialogState<T> {
  mode: DialogMode;
  data?: T;
  isOpen: boolean;
}

export const useDialog = <T>(initialData?: T) => {
  const [dialogState, setDialogState] = useState<DialogState<T>>({
    mode: "closed",
    data: initialData,
    isOpen: false,
  });

  const openCreateDialog = () => {
    setDialogState({
      mode: "create",
      data: structuredClone(initialData),
      isOpen: true,
    });
  };

  const openEditDialog = (data: T) => {
    setDialogState({
      mode: "edit",
      data: structuredClone(data),
      isOpen: true,
    });
  };

  const closeDialog = () => {
    setDialogState({
      mode: "closed",
      data: initialData,
      isOpen: false,
    });
  };

  const updateDialogData = (changes: Partial<T>) => {
    setDialogState((current) => ({
      ...current,
      data: { ...current.data, ...changes } as T,
    }));
  };

  return {
    dialogState,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateDialogData,
  };
};

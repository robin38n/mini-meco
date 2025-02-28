import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "react-bootstrap/esm/Button";

interface CourseDialogProps {
  title: string;
  trigger: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onClick?: () => void;
  onSubmit: () => Promise<void>;
  submitText?: string;
  isValid?: boolean;
  message?: string;
  children: React.ReactNode;
}

export const CourseDialog: React.FC<CourseDialogProps> = ({
  title,
  trigger,
  isOpen,
  onClose,
  onClick,
  onSubmit,
  submitText = "submit",
  isValid,
  message,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger className="bg-blue-600 mx-2" onClick={onClick}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            className="bg-blue-600 border border-black  hover:border-black hover:bg-transparent focus:ring focus:ring-gray-600"
            onClick={onSubmit}
          >
            {submitText.toUpperCase()}
          </Button>
        </DialogFooter>
        {message && (
          <div
            className={`${isValid ? "text-green-600" : "text-red-600"} text-sm`}
          >
            {message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

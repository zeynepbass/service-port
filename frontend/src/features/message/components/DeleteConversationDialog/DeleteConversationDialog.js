"use client";

import { Button } from "@/shared/components/atoms";
import { Modal } from "@/shared/components/molecules";

export function DeleteConversationDialog({ open, onClose, onConfirm, isDeleting }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sohbeti sil"
      description="Sohbet yalnızca senin görünümünden kaldırılır. Karşı taraf mesaj geçmişini görmeye devam eder."
    >
      <div className="space-y-3">
        <Button onClick={onConfirm} variant="danger" disabled={isDeleting}>
          {isDeleting ? "Siliniyor..." : "Sohbeti sil"}
        </Button>
        <Button onClick={onClose} variant="outline">
          Vazgeç
        </Button>
      </div>
    </Modal>
  );
}

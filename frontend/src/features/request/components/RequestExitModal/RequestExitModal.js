"use client";

import { Button } from "@/shared/components/atoms";
import { Modal } from "@/shared/components/molecules";

export function RequestExitModal({ open, onClose, onExit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Emin misin?"
      description="Birkaç soruya daha cevap vererek ücretsiz teklif alabilirsin."
    >
      <div className="space-y-3">
        <Button onClick={onClose} variant="primary">
          Devam et
        </Button>
        <Button onClick={onExit} variant="outline">
          Çık
        </Button>
      </div>
    </Modal>
  );
}

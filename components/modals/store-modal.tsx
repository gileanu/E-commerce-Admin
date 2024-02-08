"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
    const storeModal = useStoreModal();

    return (
        <Modal title="Create new Store" description="Add a new store first:" isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
            TODO: Add form
        </Modal>
    );
};
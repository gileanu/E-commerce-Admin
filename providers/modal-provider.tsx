"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [isMonted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMonted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    )
}
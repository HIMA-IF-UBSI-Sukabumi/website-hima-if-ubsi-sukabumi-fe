import {useState} from "react";

export interface ModalState {
    openModal: Record<string, boolean>;
    disabled: Record<string, boolean>;
    isLoading: Record<string, boolean>;
    open: (name: string) => void;
    close: (name: string) => void;
    setDisable: (name: string, value?: boolean) => void;
    setLoading: (name: string, value?: boolean) => void;
    reset: () => void;
}

const useModal = (): ModalState => {
    const [openModal, setOpenModal] = useState<Record<string, boolean>>({});
    const [disabled, setDisabled] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

    const open = (name: string) => {
        setOpenModal((prev) => ({...prev, [name]: true}));
    };

    const close = (name: string) => {
        setOpenModal((prev) => ({...prev, [name]: false}));
        setDisabled((prev) => ({...prev, [name]: false}));
        setIsLoading((prev) => ({...prev, [name]: false}));
    };

    const setDisable = (name: string, value = false) => {
        setDisabled((prev) => ({...prev, [name]: value}));
    };

    const setLoading = (name: string, value = false) => {
        setIsLoading((prev) => ({...prev, [name]: value}));
    };

    const reset = () => {
        setOpenModal({});
        setDisabled({});
        setIsLoading({});
    };

    return {
        openModal,
        disabled,
        isLoading,
        open,
        close,
        setDisable,
        setLoading,
        reset,
    };
};

export default useModal;
import {cn} from "../../lib/utils.ts";
import type {ModalState} from "../../hooks/use-modal.ts";

export interface BaseModalProps extends React.HTMLAttributes<HTMLDivElement> {
    modalState: ModalState;
    modalName: string;
    title?: string;
}

const BaseModal = ({
                       modalState,
                       modalName,
                       title,
                       className,
                       children,
                       ...props
                   }: BaseModalProps) => {
    const isOpen = modalState.openModal[modalName];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-6"
            onClick={() => modalState.close(modalName)}
            {...props}
        >
            <div
                className={cn(
                    "bg-white rounded-2xl shadow-2xl relative my-8 w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in duration-200",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
                    {title && (
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                            {title}
                        </h2>
                    )}
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer transition"
                        onClick={() => modalState.close(modalName)}
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-5 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BaseModal;
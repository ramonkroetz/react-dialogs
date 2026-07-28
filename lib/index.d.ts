import { Context } from 'react';
import { JSX } from 'react';
import { PropsWithChildren } from 'react';
import { ReactNode } from 'react';
import { Variants } from 'motion/react';

export declare function Dialog({ id, children, animation, onClose }: PropsWithChildren<DialogProps>): JSX.Element;

export declare const DialogContext: Context<DialogContextProps>;

declare type DialogContextProps = {
    dialogs: DialogState['dialogs'];
    show: (dialogId: string, props?: Record<string, unknown>) => void;
    close: (dialogId: string) => void;
    updateProps: (dialogId: string, props: Record<string, unknown>) => void;
    registerDialogId: (dialogId: string) => void;
    unregisterDialogId: (dialogId: string) => void;
};

declare type DialogProps = {
    id: string;
    animation?: Variants | null;
    onClose?: () => void;
};

export declare function DialogProvider({ children, dialogs }: PropsWithChildren<{
    dialogs?: ReactNode;
}>): JSX.Element;

declare type DialogState = {
    dialogs: Record<string, ModalState>;
};

declare type ModalState = {
    isOpen: boolean;
    props: Record<string, unknown>;
};

export declare function useDialog<T>(id: string): {
    show: (showProps?: T) => void;
    close: () => void;
    updateProps: (newProps?: Partial<T>) => void;
    isOpen: boolean;
    props: T | undefined;
};

export { }

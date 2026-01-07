import * as react_jsx_runtime from 'react/jsx-runtime';
import { Variants } from 'motion/react';
import * as react from 'react';
import { PropsWithChildren, ReactNode } from 'react';

type DialogProps = {
    id: string;
    animation?: Variants | null;
    onClickAwayCallback?: () => void;
};
declare function Dialog({ id, children, animation, onClickAwayCallback, }: PropsWithChildren<DialogProps>): react_jsx_runtime.JSX.Element;

type ModalProps = {
    show: () => void;
    close: () => void;
    isOpen: boolean;
    props: Record<string, unknown>;
};
type DialogContextProps = {
    modals: Record<string, ModalProps>;
    show: (modalId: string, props?: Record<string, unknown>) => void;
    close: (modalId: string) => void;
    overlayOrder: string[];
    updateProps: (modalId: string, props: Record<string, unknown>) => void;
};
declare const DialogContext: react.Context<DialogContextProps>;
declare function DialogProvider({ children, dialogs }: PropsWithChildren<{
    dialogs: ReactNode;
}>): react_jsx_runtime.JSX.Element;

declare function useDialog<T>(id: string): {
    show: (showProps?: T) => void;
    close: () => void;
    updateProps: (newProps?: T) => void;
    isOpen: boolean;
    props: T | undefined;
    isTopDialog: boolean;
};

export { Dialog, DialogContext, DialogProvider, useDialog };

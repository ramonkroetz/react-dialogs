import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'

type ModalState = {
  isOpen: boolean
  props: Record<string, unknown>
}

type DialogState = {
  dialogs: Record<string, ModalState>
}

const DIALOG_REDUCER_INITIAL_STATE: DialogState = {
  dialogs: {},
}

type DialogContextProps = {
  dialogs: DialogState['dialogs']
  show: (dialogId: string, props?: Record<string, unknown>) => void
  close: (dialogId: string) => void
  updateProps: (dialogId: string, props: Record<string, unknown>) => void
  registerDialogId: (dialogId: string) => void
  unregisterDialogId: (dialogId: string) => void
}

const DIALOG_CONTEXT_INITIAL_STATE: DialogContextProps = {
  dialogs: {},
  show: () => {},
  close: () => {},
  updateProps: () => {},
  registerDialogId: () => {},
  unregisterDialogId: () => {},
}

export const DialogContext = createContext(DIALOG_CONTEXT_INITIAL_STATE)

type DialogReducerActionType =
  | { type: 'ShowDialog'; payload: { dialogId: string; props: Record<string, unknown> } }
  | { type: 'CloseDialog'; payload: { dialogId: string } }
  | { type: 'UpdatePropsDialog'; payload: { dialogId: string; props: Record<string, unknown> } }

function DialogReducer(state: DialogState, { type, payload }: DialogReducerActionType): DialogState {
  switch (type) {
    case 'ShowDialog': {
      const { dialogId, props } = payload

      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [dialogId]: {
            ...state.dialogs[dialogId],
            isOpen: true,
            props,
          },
        },
      }
    }
    case 'CloseDialog': {
      const { dialogId } = payload

      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [dialogId]: {
            ...state.dialogs[dialogId],
            isOpen: false,
          },
        },
      }
    }
    case 'UpdatePropsDialog': {
      const { dialogId, props } = payload

      const updatedProps = {
        ...state.dialogs[dialogId].props,
        ...props,
      }

      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [dialogId]: {
            ...state.dialogs[dialogId],
            props: updatedProps,
          },
        },
      }
    }
  }
}

export function DialogProvider({ children, dialogs = null }: PropsWithChildren<{ dialogs?: ReactNode }>) {
  const parentContext = useContext(DialogContext)
  const hasParentProvider = parentContext !== DIALOG_CONTEXT_INITIAL_STATE

  const [state, dispatch] = useReducer(DialogReducer, DIALOG_REDUCER_INITIAL_STATE)
  const localDialogIds = useRef<Set<string>>(new Set())

  const show = useCallback(
    (dialogId: string, props = {}) => {
      if (localDialogIds.current.has(dialogId) || !hasParentProvider) {
        dispatch({ type: 'ShowDialog', payload: { dialogId, props } })
        return
      }

      parentContext.show(dialogId, props)
    },
    [hasParentProvider, parentContext],
  )

  const close = useCallback(
    (dialogId: string) => {
      if (localDialogIds.current.has(dialogId) || !hasParentProvider) {
        dispatch({ type: 'CloseDialog', payload: { dialogId } })
        return
      }

      parentContext.close(dialogId)
    },
    [hasParentProvider, parentContext],
  )

  const updateProps = useCallback(
    (dialogId: string, props: Record<string, unknown>) => {
      if (localDialogIds.current.has(dialogId) || !hasParentProvider) {
        dispatch({ type: 'UpdatePropsDialog', payload: { dialogId, props } })
        return
      }

      parentContext.updateProps(dialogId, props)
    },
    [hasParentProvider, parentContext],
  )

  const registerDialogId = useCallback((dialogId: string) => {
    localDialogIds.current.add(dialogId)
  }, [])

  const unregisterDialogId = useCallback((dialogId: string) => {
    localDialogIds.current.delete(dialogId)
  }, [])

  const mergedDialogs = useMemo(
    () => ({
      ...parentContext.dialogs,
      ...state.dialogs,
    }),
    [parentContext.dialogs, state.dialogs],
  )

  const context = useMemo(
    () => ({
      dialogs: mergedDialogs,
      show,
      close,
      updateProps,
      registerDialogId,
      unregisterDialogId,
    }),
    [mergedDialogs, show, close, updateProps, registerDialogId, unregisterDialogId],
  )

  return (
    <DialogContext value={context}>
      {children}
      <Portal>{dialogs}</Portal>
    </DialogContext>
  )
}

const Portal = ({ children }: PropsWithChildren) => {
  const portalRoot = document.body
  return createPortal(children, portalRoot)
}

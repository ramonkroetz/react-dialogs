import { createContext, type PropsWithChildren, type ReactNode, useCallback, useMemo, useReducer } from 'react'
import { createPortal } from 'react-dom'
import { useEvent } from 'react-use'

type ModalProps = {
  show: () => void
  close: () => void
  isOpen: boolean
  props: Record<string, unknown>
}

type DialogContextProps = {
  modals: Record<string, ModalProps>
  show: (modalId: string, props?: Record<string, unknown>) => void
  close: (modalId: string) => void
  overlayOrder: string[]
  updateProps: (modalId: string, props: Record<string, unknown>) => void
}

const DIALOG_CONTEXT_INITIAL_STATE: DialogContextProps = {
  modals: {},
  show: () => {},
  close: () => {},
  overlayOrder: [],
  updateProps: () => {},
}

export const DialogContext = createContext(DIALOG_CONTEXT_INITIAL_STATE)

type DialogReducerActionType =
  | { type: 'ShowModal'; payload: { modalId: string; props: Record<string, unknown> } }
  | { type: 'CloseModal'; payload: { modalId: string } }
  | { type: 'CloseTopModal'; payload?: undefined }
  | { type: 'UpdatePropsModal'; payload: { modalId: string; props: Record<string, unknown> } }

function DialogReducer(state: DialogContextProps, { type, payload }: DialogReducerActionType) {
  switch (type) {
    case 'ShowModal': {
      const { modalId, props } = payload

      return {
        ...state,
        overlayOrder: [...state.overlayOrder, modalId],
        modals: {
          ...state.modals,
          [modalId]: {
            ...state.modals[modalId],
            isOpen: true,
            props,
          },
        },
      }
    }
    case 'CloseModal': {
      const { modalId } = payload

      return {
        ...state,
        overlayOrder: state.overlayOrder.filter((id) => id !== modalId),
        modals: {
          ...state.modals,
          [modalId]: {
            ...state.modals[modalId],
            isOpen: false,
          },
        },
      }
    }
    case 'CloseTopModal': {
      if (state.overlayOrder.length === 0) {
        return state
      }

      const modalId = state.overlayOrder[state.overlayOrder.length - 1]

      return {
        ...state,
        overlayOrder: state.overlayOrder.slice(0, -1),
        modals: {
          ...state.modals,
          [modalId]: {
            ...state.modals[modalId],
            isOpen: false,
          },
        },
      }
    }
    case 'UpdatePropsModal': {
      const { modalId, props } = payload

      return {
        ...state,
        modals: {
          ...state.modals,
          [modalId]: {
            ...state.modals[modalId],
            props,
          },
        },
      }
    }
  }
}

export function DialogProvider({ children, dialogs }: PropsWithChildren<{ dialogs: ReactNode }>) {
  const [state, dispatch] = useReducer(DialogReducer, DIALOG_CONTEXT_INITIAL_STATE)

  useEvent('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Esc' || (event.key === 'Escape' && state.overlayOrder.length > 0)) {
      dispatch({ type: 'CloseTopModal' })
    }
  })

  const show = useCallback((modalId: string, props = {}) => {
    dispatch({ type: 'ShowModal', payload: { modalId, props } })
  }, [])

  const close = useCallback((modalId: string) => {
    dispatch({ type: 'CloseModal', payload: { modalId } })
  }, [])

  const updateProps = useCallback((modalId: string, props: Record<string, unknown>) => {
    dispatch({ type: 'UpdatePropsModal', payload: { modalId, props } })
  }, [])

  const context = useMemo(
    () => ({
      ...state,
      show,
      close,
      updateProps,
    }),
    [state, show, close, updateProps],
  )

  return (
    <DialogContext.Provider value={context}>
      {children}
      <Portal>{dialogs}</Portal>
    </DialogContext.Provider>
  )
}

const Portal = ({ children }: PropsWithChildren) => {
  const portalRoot = document.body
  return createPortal(children, portalRoot)
}

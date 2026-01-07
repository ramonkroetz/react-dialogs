'use-client'

import { useCallback, useContext } from 'react'

import { DialogContext } from '../contexts/DialogProvider'

export function useDialog<T>(id: string) {
  const { modals, overlayOrder, show: showModal, close: closeModal, updateProps } = useContext(DialogContext)

  const show = useCallback((showProps?: T) => showModal(id, showProps || {}), [showModal, id])
  const close = useCallback(() => closeModal(id), [id, closeModal])
  const updatePropsDialog = useCallback((newProps?: T) => updateProps(id, newProps || {}), [id, updateProps])

  return {
    show,
    close,
    updateProps: updatePropsDialog,
    isOpen: modals[id]?.isOpen ?? false,
    props: modals[id]?.props as T | undefined,
    isTopDialog: overlayOrder.length > 0 && id === overlayOrder[overlayOrder.length - 1],
  }
}

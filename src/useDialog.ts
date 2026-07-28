import { useCallback, useContext } from 'react'

import { DialogContext } from './DialogProvider'

export function useDialog<T>(id: string) {
  const { dialogs, show: showDialog, close: closeDialog, updateProps } = useContext(DialogContext)

  const show = useCallback((showProps?: T) => showDialog(id, showProps || {}), [showDialog, id])
  const close = useCallback(() => closeDialog(id), [id, closeDialog])
  const updatePropsDialog = useCallback((newProps?: Partial<T>) => updateProps(id, newProps || {}), [id, updateProps])

  return {
    show,
    close,
    updateProps: updatePropsDialog,
    isOpen: dialogs[id]?.isOpen ?? false,
    props: dialogs[id]?.props as T | undefined,
  }
}

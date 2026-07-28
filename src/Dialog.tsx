import { AnimatePresence, motion, type Variants } from 'motion/react'
import { type PropsWithChildren, useCallback, useContext, useEffect } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

import { DialogContext } from './DialogProvider'
import { useClickAway } from './useClickAway'
import { useDialog } from './useDialog'

type DialogProps = {
  id: string
  animation?: Variants | null
  onClose?: () => void
}

const DEFAULT_ANIMATION: Variants = {
  initial: { opacity: 0, scale: 0.75 },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.75,
  },
}

const stackOpenDialogsIds: string[] = []

export function Dialog({ id, children, animation = DEFAULT_ANIMATION, onClose }: PropsWithChildren<DialogProps>) {
  const { registerDialogId, unregisterDialogId } = useContext(DialogContext)
  const { isOpen, close } = useDialog(id)

  useEffect(() => {
    registerDialogId(id)

    return () => {
      unregisterDialogId(id)
    }
  }, [id, registerDialogId, unregisterDialogId])

  useEffect(() => {
    function removeDialogIdFromStack() {
      const index = stackOpenDialogsIds.indexOf(id)

      if (index !== -1) {
        stackOpenDialogsIds.splice(index, 1)
      }
    }

    if (isOpen) {
      stackOpenDialogsIds.push(id)
    } else {
      removeDialogIdFromStack()
    }

    return () => {
      removeDialogIdFromStack()
    }
  }, [id, isOpen])

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    } else {
      close()
    }
  }, [onClose, close])

  const onCloseDelayed = useCallback(() => {
    setTimeout(() => {
      const isTopDialog = stackOpenDialogsIds.length > 0 && stackOpenDialogsIds[stackOpenDialogsIds.length - 1] === id
      if (isOpen && isTopDialog) {
        handleClose()
      }
    }, 0)
  }, [id, isOpen, handleClose])

  const contentRef = useClickAway(onCloseDelayed)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const isEscapeKeyPressed = event.key === 'Esc' || event.key === 'Escape'

      if (isEscapeKeyPressed) {
        event.preventDefault()
        onCloseDelayed()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onCloseDelayed])

  const animationProps = animation ?? {}

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.dialog
          {...animationProps}
          className="react-dialog"
          onCancel={(e) => e.preventDefault()}
          ref={(node: HTMLDialogElement) => {
            if (node) {
              node.showModal()
            }
          }}
        >
          <RemoveScroll className="react-dialog-content" ref={contentRef}>
            {children}
          </RemoveScroll>
        </motion.dialog>
      )}
    </AnimatePresence>
  )
}

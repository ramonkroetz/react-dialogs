import { AnimatePresence, motion, type Variants } from 'motion/react'
import { type PropsWithChildren, useRef } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { useClickAway } from 'react-use'

import { useDialog } from '../hooks/useDialog'

type DialogProps = {
  id: string
  animation?: Variants | null
  onClickAwayCallback?: () => void
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

export function Dialog({
  id,
  children,
  animation = DEFAULT_ANIMATION,
  onClickAwayCallback,
}: PropsWithChildren<DialogProps>) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { isOpen, close, isTopDialog } = useDialog(id)

  useClickAway(contentRef, () => {
    setTimeout(() => {
      if (isOpen && isTopDialog) {
        onClickAwayCallback?.()
        close()
      }
    }, 0)
  })

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

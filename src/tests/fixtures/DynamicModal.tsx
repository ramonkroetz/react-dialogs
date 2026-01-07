import { Dialog } from '../../components/Dialog'
import { useDialog } from '../../hooks/useDialog'

export const DYNAMIC_MODAL_ID = 'dynamicModal'

export type DynamicModalProps = {
  message: string
}

export function DynamicModal() {
  const { close, props } = useDialog<DynamicModalProps>(DYNAMIC_MODAL_ID)

  return (
    <Dialog id={DYNAMIC_MODAL_ID}>
      <h2>{props?.message}</h2>
      <button onClick={close} type="button">
        Ok
      </button>
    </Dialog>
  )
}

import { Dialog } from '../../components/Dialog'
import { useDialog } from '../../hooks/useDialog'

export const SIMPLE_MODAL_ID = 'simpleModal'

export function SimpleModal() {
  const { close } = useDialog(SIMPLE_MODAL_ID)

  return (
    <Dialog id={SIMPLE_MODAL_ID}>
      <h2>Simple Modal</h2>
      <button onClick={close} type="button">
        Ok
      </button>
    </Dialog>
  )
}

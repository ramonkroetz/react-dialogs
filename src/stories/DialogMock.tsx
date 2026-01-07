import { Dialog } from '../components/Dialog'
import { useDialog } from '../hooks/useDialog'

import '../../styles.css'

export const SIMPLE_MOCK_MODAL_ID = 'dynamicModal'

export function SimpleMockModal() {
  const { close, props } = useDialog<{ message: string }>(SIMPLE_MOCK_MODAL_ID)

  return (
    <Dialog id={SIMPLE_MOCK_MODAL_ID}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{props?.message}</h2>
        <button onClick={close} type="button">
          Ok
        </button>
      </div>
    </Dialog>
  )
}

export const CUSTOM_ANIMATION_MOCK_MODAL_ID = 'customAnimationModal'

export function CustomAnimationMockModal() {
  const { close, props } = useDialog<{ message: string }>(CUSTOM_ANIMATION_MOCK_MODAL_ID)

  return (
    <Dialog
      animation={{
        initial: { opacity: 0, translate: '100%' },
        animate: { opacity: 1, translate: '0%' },
        exit: { opacity: 0, translate: '100%' },
      }}
      id={CUSTOM_ANIMATION_MOCK_MODAL_ID}
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{props?.message}</h2>
        <button onClick={close} type="button">
          Ok
        </button>
      </div>
    </Dialog>
  )
}

export const OPEN_OTHER_DIALOG_MOCK_MODAL_ID = 'openOtherDialogModal'

export function DialogOpenOtherDialogMock() {
  const { close } = useDialog(OPEN_OTHER_DIALOG_MOCK_MODAL_ID)
  const { show } = useDialog(SIMPLE_MOCK_MODAL_ID)

  return (
    <Dialog id={OPEN_OTHER_DIALOG_MOCK_MODAL_ID}>
      <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2>Open other dialog</h2>

        <button onClick={() => show({ message: 'This is a modal.' })} type="button">
          Open Dialog
        </button>

        <button onClick={close} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}

export const UPDATE_PROPS_MOCK_MODAL_ID = 'updatePropsModal'

export function DialogUpdatePropsMock() {
  const { close, props, updateProps } = useDialog<{ message: string }>(UPDATE_PROPS_MOCK_MODAL_ID)

  return (
    <Dialog id={UPDATE_PROPS_MOCK_MODAL_ID}>
      <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2>Random number: {props?.message}</h2>

        <button onClick={() => updateProps({ message: Math.floor(Math.random() * 100).toString() })} type="button">
          Uptade props inside modal
        </button>

        <button onClick={close} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}

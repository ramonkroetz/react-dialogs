import { Dialog, DialogProvider, useDialog } from 'react-dialogs'

const SIMPLE_MOCK_MODAL_ID = 'dynamicModal'
const CUSTOM_ANIMATION_MOCK_MODAL_ID = 'customAnimationModal'
const OPEN_OTHER_DIALOG_MOCK_MODAL_ID = 'openOtherDialogModal'
const UPDATE_PROPS_MOCK_MODAL_ID = 'updatePropsModal'
const ON_CLOSE_MOCK_MODAL_ID = 'onClosePropsModal'

function DialogExamples() {
  const { show: showDefault } = useDialog<{ message: string }>(SIMPLE_MOCK_MODAL_ID)
  const { show: showCustomAnimation } = useDialog<{ message: string }>(CUSTOM_ANIMATION_MOCK_MODAL_ID)
  const { show: showTwoOrMore } = useDialog(OPEN_OTHER_DIALOG_MOCK_MODAL_ID)
  const { show: showUpdateProps } = useDialog<{ message: string; title: string }>(UPDATE_PROPS_MOCK_MODAL_ID)
  const { show: showOnCloseProps } = useDialog<{ message: string }>(ON_CLOSE_MOCK_MODAL_ID)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      <h2>Dialog examples</h2>

      <button onClick={() => showDefault({ message: 'This is a modal.' })} type="button">
        Open Dialog
      </button>

      <button onClick={() => showCustomAnimation({ message: 'This is a modal.' })} type="button">
        Open Dialog With Custom Animation
      </button>

      <button onClick={() => showTwoOrMore()} type="button">
        Open Dialog That Opens Another Dialog
      </button>

      <button onClick={() => showUpdateProps({ message: 'random number', title: 'Sorteio' })} type="button">
        Open Dialog Updating Props
      </button>

      <button onClick={() => showOnCloseProps({ message: 'This is a modal.' })} type="button">
        Open Dialog With onClose
      </button>

      <div style={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => showDefault({ message: 'This is a modal with page scroll' })} type="button">
          Open Dialog With Page Scroll
        </button>
      </div>
    </div>
  )
}

function SimpleMockModal() {
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

function CustomAnimationMockModal() {
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

function DialogOpenOtherDialogMock() {
  const { close } = useDialog(OPEN_OTHER_DIALOG_MOCK_MODAL_ID)
  const { show } = useDialog<{ message: string }>(SIMPLE_MOCK_MODAL_ID)

  return (
    <Dialog id={OPEN_OTHER_DIALOG_MOCK_MODAL_ID}>
      <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2>Open other dialog</h2>
        <input type="text" />
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

function DialogUpdatePropsMock() {
  const { close, props, updateProps } = useDialog<{ message: string; title: string }>(UPDATE_PROPS_MOCK_MODAL_ID)

  return (
    <Dialog id={UPDATE_PROPS_MOCK_MODAL_ID}>
      <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h1>{props?.title}</h1>
        <h2>Random number: {props?.message}</h2>

        <button onClick={() => updateProps({ message: Math.floor(Math.random() * 100).toString() })} type="button">
          Update props inside modal
        </button>

        <button onClick={close} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}

function DialogOnClosePropsMock() {
  const { close, props } = useDialog<{ message: string; title?: string }>(ON_CLOSE_MOCK_MODAL_ID)

  const handleClose = () => {
    alert('Modal closed')
    close()
  }

  return (
    <Dialog id={ON_CLOSE_MOCK_MODAL_ID} onClose={handleClose}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{props?.message}</h2>
        <button onClick={handleClose} type="button">
          Ok
        </button>
      </div>
    </Dialog>
  )
}

export function BasicDialogsExample() {
  return (
    <DialogProvider
      dialogs={
        <>
          <SimpleMockModal />
          <CustomAnimationMockModal />
          <DialogOpenOtherDialogMock />
          <DialogUpdatePropsMock />
          <DialogOnClosePropsMock />
        </>
      }
    >
      <DialogExamples />
    </DialogProvider>
  )
}

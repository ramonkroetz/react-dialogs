import { createContext, useContext } from 'react'

import { Dialog, DialogProvider, useDialog } from 'react-dialogs'

const OUTER_DIALOG_ID = 'outerNestedDialog'
const MIDDLE_DIALOG_ID = 'middleNestedDialog'
const INNER_DIALOG_ID = 'innerNestedDialog'
const INNER_CHILD_DIALOG_ID = 'innerChildNestedDialog'

const UserContext = createContext('Anonymous')

function OuterDialog() {
  const { close } = useDialog(OUTER_DIALOG_ID)

  return (
    <Dialog id={OUTER_DIALOG_ID}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Outer provider dialog</h2>
        <button onClick={close} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}

function MiddleDialog() {
  const { close } = useDialog(MIDDLE_DIALOG_ID)
  const userName = useContext(UserContext)

  return (
    <Dialog id={MIDDLE_DIALOG_ID}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Middle provider dialog</h2>
        <p>User from context: {userName}</p>
        <button onClick={close} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}

function InnerDialog() {
  const { close, props } = useDialog<{ message: string }>(INNER_DIALOG_ID)
  const { show: showInnerChild } = useDialog<{ message: string }>(INNER_CHILD_DIALOG_ID)
  const userName = useContext(UserContext)

  return (
    <Dialog id={INNER_DIALOG_ID}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{props?.message ?? 'Inner provider dialog'}</h2>
        <p>User from context: {userName}</p>
        <button onClick={() => showInnerChild({ message: 'Dialog opened from InnerDialog' })} type="button">
          Open Other Dialog
        </button>
        <button onClick={close} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}

function InnerChildDialog() {
  const { close, props } = useDialog<{ message: string }>(INNER_CHILD_DIALOG_ID)

  return (
    <Dialog id={INNER_CHILD_DIALOG_ID}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{props?.message ?? 'Inner child dialog'}</h2>
        <button onClick={close} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}

function NestedDialogControls() {
  const { show: showOuter } = useDialog(OUTER_DIALOG_ID)
  const { show: showMiddle } = useDialog(MIDDLE_DIALOG_ID)
  const { show: showInner } = useDialog<{ message: string }>(INNER_DIALOG_ID)

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <button onClick={() => showOuter()} type="button">
        Open Outer Dialog
      </button>
      <button onClick={() => showMiddle()} type="button">
        Open Middle Dialog
      </button>
      <button onClick={() => showInner({ message: 'Inner provider dialog with props' })} type="button">
        Open Inner Dialog
      </button>
    </div>
  )
}

export function NestedProvidersExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2>Nested providers example</h2>

      <DialogProvider dialogs={<OuterDialog />}>
        <UserContext.Provider value="John Doe">
          <DialogProvider
            dialogs={
              <>
                <MiddleDialog />
                <InnerChildDialog />
              </>
            }
          >
            <DialogProvider dialogs={<InnerDialog />}>
              <NestedDialogControls />
            </DialogProvider>
          </DialogProvider>
        </UserContext.Provider>
      </DialogProvider>
    </div>
  )
}

import type { Meta } from '@storybook/react'

import { DialogProvider } from '../contexts/DialogProvider'
import { useDialog } from '../hooks/useDialog'
import {
  CUSTOM_ANIMATION_MOCK_MODAL_ID,
  CustomAnimationMockModal,
  DialogOpenOtherDialogMock,
  DialogUpdatePropsMock,
  OPEN_OTHER_DIALOG_MOCK_MODAL_ID,
  SIMPLE_MOCK_MODAL_ID,
  SimpleMockModal,
  UPDATE_PROPS_MOCK_MODAL_ID,
} from './DialogMock'

const meta: Meta = {
  title: 'Dialog',
  decorators: [
    (Story) => (
      <DialogProvider
        dialogs={
          <>
            <SimpleMockModal />
            <CustomAnimationMockModal />
            <DialogOpenOtherDialogMock />
            <DialogUpdatePropsMock />
          </>
        }
      >
        <Story />
      </DialogProvider>
    ),
  ],
}
export default meta

export const Default = () => {
  const { show } = useDialog(SIMPLE_MOCK_MODAL_ID)

  return (
    <button onClick={() => show({ message: 'This is a modal.' })} type="button">
      Open Dialog
    </button>
  )
}

export const CustomAnimation = () => {
  const { show } = useDialog(CUSTOM_ANIMATION_MOCK_MODAL_ID)

  return (
    <button onClick={() => show({ message: 'This is a modal.' })} type="button">
      Open Dialog
    </button>
  )
}

export const ModalWithPageScroll = () => {
  const { show } = useDialog(SIMPLE_MOCK_MODAL_ID)

  return (
    <div style={{ height: '1000px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button onClick={() => show({ message: 'This is a modal with page scroll' })} type="button">
        Open Dialog
      </button>
    </div>
  )
}

export const TwoOrMoreDialogsOpen = () => {
  const { show } = useDialog(OPEN_OTHER_DIALOG_MOCK_MODAL_ID)

  return (
    <button onClick={() => show()} type="button">
      Open Dialog
    </button>
  )
}

export const ModalUpdatingProps = () => {
  const { show } = useDialog(UPDATE_PROPS_MOCK_MODAL_ID)

  return (
    <button onClick={() => show({ message: 'random number' })} type="button">
      Open Dialog
    </button>
  )
}

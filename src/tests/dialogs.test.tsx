import { fireEvent, renderHook, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { act, createContext, useContext } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { Dialog } from '../Dialog'
import { DialogProvider } from '../DialogProvider'
import { useDialog } from '../useDialog'
import { DYNAMIC_MODAL_ID, DynamicModal } from './fixtures/DynamicModal'
import { SIMPLE_MODAL_ID, SimpleModal } from './fixtures/SimpleModal'

/*
 * Mock dialog methods for testing environment (e.g., jsdom),
 * which doesn't fully implement the HTMLDialogElement API.
 * This prevents errors when calling showModal() or close() in tests.
 */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
})

describe('react-modal', () => {
  it("using the 'useDialog' hook", async () => {
    const { result } = renderHook(() => useDialog(SIMPLE_MODAL_ID), {
      wrapper: ({ children }) => <DialogProvider dialogs={<SimpleModal />}>{children}</DialogProvider>,
    })

    act(() => result.current.show())
    const simpleModalElement = screen.getByText('Simple Modal')
    expect(simpleModalElement).toBeTruthy()
    expect(result.current.isOpen).toBeTruthy()
    act(() => result.current.close())
    expect(result.current.isOpen).toBeFalsy()
  })

  it('should show modal with correct props when overridden', async () => {
    const { result } = renderHook(() => useDialog(DYNAMIC_MODAL_ID), {
      wrapper: ({ children }) => <DialogProvider dialogs={<DynamicModal />}>{children}</DialogProvider>,
    })

    act(() => result.current.show({ message: 'Hello World' }))
    const dynamicModalElement = screen.getByText('Hello World')
    expect(dynamicModalElement).toBeTruthy()
    act(() => result.current.close())

    act(() => result.current.show({ message: 'Hello World2' }))
    const dynamicModalElement2 = screen.getByText('Hello World2')
    expect(dynamicModalElement2).toBeTruthy()
  })

  it('closes modal when esc key is pressed', async () => {
    const { result } = renderHook(() => useDialog(SIMPLE_MODAL_ID), {
      wrapper: ({ children }) => <DialogProvider dialogs={<SimpleModal />}>{children}</DialogProvider>,
    })

    act(() => result.current.show())
    const simpleModalElement = screen.getByText('Simple Modal')
    expect(simpleModalElement).toBeTruthy()

    act(() => {
      fireEvent.keyDown(document.body.ownerDocument.defaultView as Window, { key: 'Esc' })
    })

    await waitForElementToBeRemoved(simpleModalElement)
  })

  it('shows the status correctly when opening and closing the modal', async () => {
    const { result } = renderHook(() => useDialog(SIMPLE_MODAL_ID), {
      wrapper: ({ children }) => <DialogProvider dialogs={<SimpleModal />}>{children}</DialogProvider>,
    })

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.show()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.close()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('update props correctly inside dialog', async () => {
    const { result } = renderHook(() => useDialog(DYNAMIC_MODAL_ID), {
      wrapper: ({ children }) => <DialogProvider dialogs={<DynamicModal />}>{children}</DialogProvider>,
    })

    act(() => result.current.show({ message: 'Hello World' }))
    expect(screen.getByText('Hello World')).toBeTruthy()
    act(() => result.current.updateProps({ message: 'Hello World2' }))
    expect(screen.getByText('Hello World2')).toBeTruthy()
  })

  it('uses dialogs prop to configure dialogs in provider', async () => {
    const { result } = renderHook(() => useDialog(SIMPLE_MODAL_ID), {
      wrapper: ({ children }) => <DialogProvider dialogs={<SimpleModal />}>{children}</DialogProvider>,
    })

    act(() => result.current.show())
    const simpleModalElement = screen.getByText('Simple Modal')
    expect(simpleModalElement).toBeTruthy()
  })

  it('uses dialogs prop for multiple dialogs', async () => {
    const { result } = renderHook(
      () => ({
        simpleDialog: useDialog(SIMPLE_MODAL_ID),
        dynamicDialog: useDialog(DYNAMIC_MODAL_ID),
      }),
      {
        wrapper: ({ children }) => (
          <DialogProvider
            dialogs={
              <>
                <SimpleModal />
                <DynamicModal />
              </>
            }
          >
            {children}
          </DialogProvider>
        ),
      },
    )

    act(() => {
      result.current.simpleDialog.show()
      result.current.dynamicDialog.show({ message: 'Two dialogs opened' })
    })

    expect(screen.getByText('Simple Modal')).toBeTruthy()
    expect(screen.getByText('Two dialogs opened')).toBeTruthy()
    expect(result.current.simpleDialog.isOpen).toBe(true)
    expect(result.current.dynamicDialog.isOpen).toBe(true)
  })

  it('supports parent dialog access from nested provider and preserves inner context dialogs', async () => {
    const USER_MODAL_ID = 'userModal'
    const UserContext = createContext('')

    function UserScopedModal() {
      const { close } = useDialog(USER_MODAL_ID)
      const user = useContext(UserContext)

      return (
        <Dialog id={USER_MODAL_ID}>
          <h2>User: {user}</h2>
          <button onClick={close} type="button">
            Ok
          </button>
        </Dialog>
      )
    }

    const { result } = renderHook(
      () => ({
        simpleDialog: useDialog(SIMPLE_MODAL_ID),
        userDialog: useDialog(USER_MODAL_ID),
      }),
      {
        wrapper: ({ children }) => (
          <DialogProvider dialogs={<SimpleModal />}>
            <UserContext.Provider value="John Doe">
              <DialogProvider dialogs={<UserScopedModal />}>{children}</DialogProvider>
            </UserContext.Provider>
          </DialogProvider>
        ),
      },
    )

    act(() => {
      result.current.userDialog.show()
      result.current.simpleDialog.show()
    })

    expect(screen.getByText('User: John Doe')).toBeTruthy()
    expect(screen.getByText('Simple Modal')).toBeTruthy()
    expect(result.current.userDialog.isOpen).toBe(true)
    expect(result.current.simpleDialog.isOpen).toBe(true)
  })

  it('supports dialog access with three nested DialogProviders', async () => {
    const USER_MODAL_ID = 'userModal'
    const UserContext = createContext('')

    function UserScopedModal() {
      const { close } = useDialog(USER_MODAL_ID)
      const user = useContext(UserContext)

      return (
        <Dialog id={USER_MODAL_ID}>
          <h2>User: {user}</h2>
          <button onClick={close} type="button">
            Ok
          </button>
        </Dialog>
      )
    }

    const { result } = renderHook(
      () => ({
        outerDialog: useDialog(SIMPLE_MODAL_ID),
        middleDialog: useDialog(USER_MODAL_ID),
        innerDialog: useDialog(DYNAMIC_MODAL_ID),
      }),
      {
        wrapper: ({ children }) => (
          <DialogProvider dialogs={<SimpleModal />}>
            <UserContext.Provider value="John Doe">
              <DialogProvider dialogs={<UserScopedModal />}>
                <DialogProvider dialogs={<DynamicModal />}>{children}</DialogProvider>
              </DialogProvider>
            </UserContext.Provider>
          </DialogProvider>
        ),
      },
    )

    act(() => {
      result.current.outerDialog.show()
      result.current.middleDialog.show()
      result.current.innerDialog.show({ message: 'Inner dialog' })
    })

    expect(screen.getByText('Simple Modal')).toBeTruthy()
    expect(screen.getByText('User: John Doe')).toBeTruthy()
    expect(screen.getByText('Inner dialog')).toBeTruthy()
    expect(result.current.outerDialog.isOpen).toBe(true)
    expect(result.current.middleDialog.isOpen).toBe(true)
    expect(result.current.innerDialog.isOpen).toBe(true)
  })

  it('closes child dialog first with esc across nested provider levels', async () => {
    const MIDDLE_MODAL_ID = 'middleEscModal'
    const INNER_CHILD_MODAL_ID = 'innerEscChildModal'

    function MiddleEscModal() {
      const { close } = useDialog(MIDDLE_MODAL_ID)
      const { show } = useDialog(INNER_CHILD_MODAL_ID)

      return (
        <Dialog id={MIDDLE_MODAL_ID}>
          <h2>Middle ESC Modal</h2>
          <button onClick={() => show()} type="button">
            Open Inner Child ESC Modal
          </button>
          <button onClick={close} type="button">
            Close Middle
          </button>
        </Dialog>
      )
    }

    function InnerEscChildModal() {
      const { close } = useDialog(INNER_CHILD_MODAL_ID)

      return (
        <Dialog id={INNER_CHILD_MODAL_ID}>
          <h2>Inner Child ESC Modal</h2>
          <button onClick={close} type="button">
            Close Inner Child
          </button>
        </Dialog>
      )
    }

    const { result } = renderHook(
      () => ({
        middleDialog: useDialog(MIDDLE_MODAL_ID),
      }),
      {
        wrapper: ({ children }) => (
          <DialogProvider>
            <DialogProvider dialogs={<MiddleEscModal />}>
              <DialogProvider dialogs={<InnerEscChildModal />}>{children}</DialogProvider>
            </DialogProvider>
          </DialogProvider>
        ),
      },
    )

    act(() => {
      result.current.middleDialog.show()
    })

    act(() => {
      fireEvent.click(screen.getByText('Open Inner Child ESC Modal'))
    })

    const childModalText = screen.getByText('Inner Child ESC Modal')
    expect(childModalText).toBeTruthy()
    expect(screen.getByText('Middle ESC Modal')).toBeTruthy()

    act(() => {
      fireEvent.keyDown(document.body.ownerDocument.defaultView as Window, { key: 'Escape' })
    })

    await waitForElementToBeRemoved(childModalText)
    expect(screen.getByText('Middle ESC Modal')).toBeTruthy()
  })

  it('closes last opened dialog first with esc in the same DialogProvider', async () => {
    const FIRST_MODAL_ID = 'firstSameProviderEscModal'
    const SECOND_MODAL_ID = 'secondSameProviderEscModal'

    function FirstModal() {
      const { close } = useDialog(FIRST_MODAL_ID)

      return (
        <Dialog id={FIRST_MODAL_ID}>
          <h2>First Same Provider Modal</h2>
          <button onClick={close} type="button">
            Close First
          </button>
        </Dialog>
      )
    }

    function SecondModal() {
      const { close } = useDialog(SECOND_MODAL_ID)

      return (
        <Dialog id={SECOND_MODAL_ID}>
          <h2>Second Same Provider Modal</h2>
          <button onClick={close} type="button">
            Close Second
          </button>
        </Dialog>
      )
    }

    const { result } = renderHook(
      () => ({
        firstModal: useDialog(FIRST_MODAL_ID),
        secondModal: useDialog(SECOND_MODAL_ID),
      }),
      {
        wrapper: ({ children }) => (
          <DialogProvider
            dialogs={
              <>
                <FirstModal />
                <SecondModal />
              </>
            }
          >
            {children}
          </DialogProvider>
        ),
      },
    )

    act(() => {
      result.current.firstModal.show()
      result.current.secondModal.show()
    })

    const secondModalText = screen.getByText('Second Same Provider Modal')
    expect(secondModalText).toBeTruthy()
    expect(screen.getByText('First Same Provider Modal')).toBeTruthy()

    act(() => {
      fireEvent.keyDown(document.body.ownerDocument.defaultView as Window, { key: 'Escape' })
    })

    await waitForElementToBeRemoved(secondModalText)
    expect(screen.getByText('First Same Provider Modal')).toBeTruthy()
  })
})

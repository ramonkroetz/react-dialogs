import { fireEvent, renderHook, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { act } from 'react'

import { DialogProvider } from '../contexts/DialogProvider'
import { useDialog } from '../hooks/useDialog'
import { DYNAMIC_MODAL_ID, DynamicModal } from './fixtures/DynamicModal'
import { SIMPLE_MODAL_ID, SimpleModal } from './fixtures/SimpleModal'

/*
 * Mock dialog methods for testing environment (e.g., jsdom),
 * which doesn't fully implement the HTMLDialogElement API.
 * This prevents errors when calling showModal() or close() in tests.
 */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn()
  HTMLDialogElement.prototype.close = jest.fn()
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
})

# react-dialogs

Package with dialog component to use on react

## Install

- After creating a new tag you can install the new version by running the following command:
```bash
npm install github:ramonkroetz/react-dialogs#v1.0.0
```

## Usage

- Example to create a custom modal

```tsx
import { useDialog, Dialog } from "react-dialogs"

export const EXAMPLE_MODAL_ID = "exampleModal"

export type ExampleModalProps = {
  message: string
}

export function ExampleModal() {
  const { close, props } = useDialog(EXAMPLE_MODAL_ID)

  return (
    <Dialog
      id={EXAMPLE_MODAL_ID}
      onClickAwayCallback={/* You can pass a callback that will be trigged on modal close */}
    >
      <p>{props?.message}</p>
      <button onClick={close}>Close Modal!</button>
    </Dialog>
  )
}
```

- Example to use your custom modal using hooks

```tsx
import { useDialog } from "react-dialogs"

function App() {
  const { show } = useDialog<ExampleModalProps>(EXAMPLE_MODAL_ID)

  return <button onClick={show({ /* props */ })}>Show Modal!</button>
}
```

## Configuration

```jsx
import { DialogProvider } from "react-dialogs"

export function GlobalProviders() {
  return <DialogProvider dialogs={<ExampleModal />}>{children}</DialogProvider>
}

export default App
```

If you need more modals, you can configure as below

```jsx
import { DialogProvider } from "react-dialogs"

export function GlobalProviders() {
  return (
    <DialogProvider
      dialogs={
        <>
          <ExampleModal />
          <ExampleModal2 />
        </>
      }
    >
      {children}
    </DialogProvider>
  )
}
```

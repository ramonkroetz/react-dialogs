import { createRoot } from 'react-dom/client'

import { BasicDialogsExample } from './BasicDialogsExample'
import { NestedProvidersExample } from './NestedProvidersExample'
import 'react-dialogs/styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(<App />)

function App() {
  return (
    <div style={{ padding: '12px' }}>
      <h1>react-dialogs examples</h1>

      <NestedProvidersExample />
      <BasicDialogsExample />
    </div>
  )
}

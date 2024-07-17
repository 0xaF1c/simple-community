import { createRoot } from 'react-dom/client'

// import assets
import './index.css'
import './i18n'
import '@fontsource/roboto'

// import components
import Layout from './layout'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <Layout>
    <App></App>
  </Layout>,
)

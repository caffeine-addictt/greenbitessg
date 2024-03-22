import * as React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@styles/globals.css'


export const Layout = ({ children }): JSX.Element => {
  return (
    <main className='flex min-h-screen min-w-full max-w-full flex-col'>
      {/* Navbar here */}
      {children}
      {/* Footer here */}
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>,
)

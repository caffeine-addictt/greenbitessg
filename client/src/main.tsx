import * as React from 'react'
import ReactDOM from 'react-dom/client'
import '@styles/globals.css'


export const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
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
    </Layout>
  </React.StrictMode>,
)

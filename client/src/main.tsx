import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { useLocation, Route, Routes, BrowserRouter } from 'react-router-dom'
import '@styles/globals.css'

import routes from '@pages/route-map'

// Components
import Navbar from '@components/navbar'
import Footer from '@components/footer'


export const Layout = (): JSX.Element => {
  const location = useLocation()

  return (
    <main className='flex min-h-screen min-w-full max-w-full flex-col'>
      <Navbar location={location} isAdmin />

      <div className='flex w-full max-w-full grow'>
        <Routes location={location}>
          {Object.entries(routes).map(([path, Component]) =>
            <Route path={path} element={<Component />} />
          )}
        </Routes>
      </div>

      <Footer location={location} isAdmin />
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>,
)

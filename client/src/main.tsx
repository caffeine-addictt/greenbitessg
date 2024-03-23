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
      <Routes location={location}>
        {Object.entries(routes).map(([path, node]) =>
          <Route path={path} element={node} />
        )}
      </Routes>
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

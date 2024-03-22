import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { useLocation, Route, Routes, BrowserRouter } from 'react-router-dom'
import '@styles/globals.css'

import routes from '@pages/route-map'


export const Layout = (): JSX.Element => {
  const location = useLocation()

  return (
    <main className='flex min-h-screen min-w-full max-w-full flex-col'>
      {/* Navbar here */}
      <Routes location={location}>
        {/* */}
        {Object.entries(routes).map(([path, node]) =>
          <Route path={path} element={node} />
        )}
      </Routes>
      {/* Footer here */}
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

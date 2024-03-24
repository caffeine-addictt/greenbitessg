import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { useLocation, Route, Routes, BrowserRouter } from 'react-router-dom';
import '@styles/globals.css';

import { Helmet } from 'react-helmet';
import routes, { type RouteDetails } from '@pages/route-map';

// Components
import Navbar from '@components/navbar';
import Footer from '@components/footer';

export const WrappedComponent = ({
  component: Component,
  title,
}: RouteDetails): JSX.Element => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Component />
  </>
);

export const Layout = (): JSX.Element => {
  const location = useLocation();

  return (
    <main className="flex min-h-screen min-w-full max-w-full flex-col">
      <Navbar location={location} isAdmin />

      <div className="flex w-full max-w-full grow">
        <Routes location={location}>
          {Object.entries(routes).map(([path, details]) => (
            <Route path={path} element={<WrappedComponent {...details} />} />
          ))}
        </Routes>
      </div>

      <Footer location={location} isAdmin />
    </main>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>,
);

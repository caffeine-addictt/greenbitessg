/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    <Component className="flex w-full max-w-full grow" />
  </>
);

export const Layout = (): JSX.Element => {
  const location = useLocation();

  return (
    <main className="flex min-h-screen min-w-full max-w-full flex-col">
      <Navbar location={location} isAdmin />

      <QueryClientProvider client={new QueryClient()}>
        <Routes location={location}>
          {Object.entries(routes).map(([path, details], i) => (
            <Route
              key={i}
              path={path}
              element={<WrappedComponent {...details} />}
            />
          ))}
        </Routes>
      </QueryClientProvider>

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

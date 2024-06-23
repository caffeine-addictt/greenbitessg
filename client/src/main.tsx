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
  path,
  title,
  description,
}: RouteDetails & { path: string }): JSX.Element => (
  <>
    <Helmet titleTemplate={path !== '/' ? '%s | GreenBitesSG' : '%s'}>
      <title>{title}</title>
      <meta
        name="description"
        content={
          description ??
          'GreenBitesSG is a community of Singaporeans who are passionate about sustainable and healthy food.'
        }
      />
    </Helmet>
    <Component className="flex w-full max-w-full grow" />
  </>
);

export const Layout = (): JSX.Element => {
  const location = useLocation();

  return (
    <main className="flex min-h-screen min-w-full max-w-full flex-col bg-background-dark text-text-dark">
      <Navbar location={location} isAdmin />

      <QueryClientProvider client={new QueryClient()}>
        <Routes location={location}>
          {Object.entries(routes).map(([path, details], i) => (
            <Route
              key={i}
              path={path}
              element={
                <WrappedComponent {...details} path={location.pathname} />
              }
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

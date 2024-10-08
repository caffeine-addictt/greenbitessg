/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ReactDOM from 'react-dom/client';
import {
  useLocation,
  Route,
  Routes,
  BrowserRouter,
  Navigate,
  useSearchParams,
} from 'react-router-dom';
import '@styles/globals.css';

import { Helmet } from 'react-helmet';
import routes, { type RouteDetails } from '@pages/route-map';

// Components
import Navbar from '@components/navbar';
import Footer from '@components/footer';
import { Toaster } from '@components/ui/toaster';
import { AuthContext, AuthProvider } from '@service/auth';
import Unauthorized from '@pages/401';

const isAuth = (level: RouteDetails['accessLevel']): boolean =>
  level === 'authenticated' || level === 'admin';

export const WrappedComponent = ({
  component: Component,
  path,
  title,
  description,
  accessLevel,
}: RouteDetails & { path: string }): JSX.Element | null => {
  const [params] = useSearchParams();
  const { isAdmin, isLoggedIn, isActivated, state } =
    React.useContext(AuthContext)!;

  // Check only if done and needs auth
  if (accessLevel !== 'public' && state === 'done') {
    // Check public-only
    if (accessLevel === 'public-only' && isLoggedIn && path !== '/') {
      return <Navigate to={params.get('callbackURI') ?? '/'} />;
    }

    // Check auth
    if (isAuth(accessLevel) && !isLoggedIn && path !== '/login') {
      return <Navigate to={`/login?callbackURI=${path}`} replace />;
    }

    // Check admin
    if (accessLevel === 'admin' && !isAdmin) {
      title = 'Unauthorized';
      description = 'You do not have permission to access this page.';
      Component = Unauthorized;
    }

    // Check activation
    if (isAuth(accessLevel) && !isActivated && !path.startsWith('/activate')) {
      return <Navigate to={`/activate?callbackURI=${path}`} replace />;
    }
  }

  // Protect auth-only
  if (isAuth(accessLevel) && state !== 'done') {
    return <></>;
  }

  return (
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
};

export const Layout = (): JSX.Element => {
  const location = useLocation();

  return (
    <div className="flex min-w-full max-w-full flex-col bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <main className="flex min-h-screen flex-col">
        <Navbar />

        <Routes location={location}>
          {Object.entries(routes).map(([path, details]) => (
            <Route
              key={path}
              path={path}
              element={
                <WrappedComponent {...details} path={location.pathname} />
              }
            />
          ))}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);

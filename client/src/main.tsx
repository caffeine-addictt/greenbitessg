// Frontend App
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
    <Component className="flex w-full max-w-full grow" />
  </>
);

export const Layout = (): JSX.Element => {
  const location = useLocation();

  return (
    <main className="flex min-h-screen min-w-full max-w-full flex-col">
      <Navbar location={location} isAdmin />

      <Routes location={location}>
        {Object.entries(routes).map(([path, details]) => (
          <Route path={path} element={<WrappedComponent {...details} />} />
        ))}
      </Routes>

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

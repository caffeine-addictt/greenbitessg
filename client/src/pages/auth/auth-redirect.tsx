/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';
import { Navigate, useSearchParams } from 'react-router-dom';

const RedirectToAuth: PageComponent = () => {
  const [params] = useSearchParams();
  const callbackURI = params.get('callbackURI');
  const targetUri = callbackURI
    ? `/login?callbackURI=${callbackURI}`
    : '/login';

  return <Navigate to={targetUri} replace />;
};
export default RedirectToAuth;

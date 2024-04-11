/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';

const NotFound: PageComponent = (props) => {
  return (
    <div {...props}>
      <h1>Page Not Found</h1>
    </div>
  );
};
export default NotFound;

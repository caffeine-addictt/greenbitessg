/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';

const Unauthorized: PageComponent = (props) => {
  return (
    <div {...props}>
      <h1>Unauthorized</h1>
    </div>
  );
};
export default Unauthorized;

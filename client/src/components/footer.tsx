/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { Location } from 'react-router-dom';

export type FooterProps = { location: Location; isAdmin: boolean };
const Footer = (props: FooterProps): React.ReactNode => {
  return <footer>Footer at {props.location.pathname}</footer>;
};
export default Footer;

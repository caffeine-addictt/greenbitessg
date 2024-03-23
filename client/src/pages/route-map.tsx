// This is the root-level final page mapping

import * as React from 'react'

// Page imports
import NotFound from '@pages/404'
import RootPage from '@pages/root'


export type PathStr = '*' | '/' | `/${string}`
export type PageComponent = () => React.JSX.Element
export type RouteMap = Record<PathStr, PageComponent>


const routes: RouteMap = {
  '*': NotFound,
  '/': RootPage,
}

export default routes


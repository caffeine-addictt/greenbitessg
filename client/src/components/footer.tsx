import * as React from 'react'
import { Location } from 'react-router-dom'


export type FooterProps = { location: Location, isAdmin: boolean }
const Footer = (props: FooterProps): React.ReactNode => {
  return (
    <footer>
      Footer at {props.location.pathname}
    </footer>
  )
}
export default Footer


import * as React from 'react'
import { Location } from 'react-router-dom'


export type NavbarProps = { location: Location, isAdmin: boolean }
const Navbar = (props: NavbarProps): React.ReactNode => {
  return (
    <nav>
      This is the navbar at {props.location.pathname}
    </nav>
  )
}
export default Navbar


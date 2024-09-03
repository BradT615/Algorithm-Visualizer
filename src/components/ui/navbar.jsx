import * as React from "react"
import { cn } from "../../lib/utils"

const Navbar = React.forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex items-center justify-between p-4 bg-background", className)}
    {...props}
  />
))
Navbar.displayName = "Navbar"

const NavbarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-4", className)}
    {...props}
  />
))
NavbarContent.displayName = "NavbarContent"

export { Navbar, NavbarContent }
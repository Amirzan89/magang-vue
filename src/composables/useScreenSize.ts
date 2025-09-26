import { useWindowSize, useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const { width } = useWindowSize()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')
const isTablet = breakpoints.between('sm', 'lg')
const isDesktop = breakpoints.greater('lg')
export { width, breakpoints, isMobile, isTablet, isDesktop }
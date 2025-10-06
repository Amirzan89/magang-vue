import { useWindowSize, useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const { width } = useWindowSize()
const customBreakpoints  = {
    '3xs': 320, // iPhone 5/SE, small Android devices
    '2xs': 375, // iPhone 8, medium Android devices
    'xs': 400,  // smaller phones, phablets
    'phone': 480, // larger phones
    'sm': 640, // small tablets
    'md': 768, // medium tablets, laptops
    'lg': 1024, // larger laptops, desktops
    'xl': 1280, // large desktops
    '2xl': 1536, // extra large desktops
}
const breakpoints = useBreakpoints(customBreakpoints)
const isMobile = breakpoints.smaller('sm')
const isTablet = breakpoints.between('sm', 'lg')
const isDesktop = breakpoints.greater('lg')
export { width, breakpoints, customBreakpoints, isMobile, isTablet, isDesktop }
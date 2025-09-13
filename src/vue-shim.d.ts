declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
    export default component
}
declare module '*.svg?component' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
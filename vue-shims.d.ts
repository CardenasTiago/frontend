// vue-shims.d.ts
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // DefineComponent<Props, RawBindings, D> con any para simplificar
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

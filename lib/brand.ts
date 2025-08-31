const XenBrand = Symbol('xen-brand');
type XenBrand<in out K extends symbol> = {
  readonly [XenBrand]: {
    readonly [key in K]: K;
  };
};
export default XenBrand;
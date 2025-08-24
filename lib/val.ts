const __val_brand: unique symbol = Symbol();

type Val = (readonly [number, number])[] & {
    [__val_brand]: unknown;
};

const Val = {};

export default Val;
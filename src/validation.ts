const isNumber = (val: unknown): val is number => {
  return typeof val === "number";
};

export const validateNumber = (n: unknown): number => {
  if (isNumber(n)) {
    return n;
  } else {
    throw new Error(`Can't consider ${n} to be a number.`);
  }
};

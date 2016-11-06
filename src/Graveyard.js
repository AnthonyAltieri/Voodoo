/**
 * @author Anthony Altieri on 11/6/16.
 */

export function combineGraves(graves) {
  if (typeof graves === 'undefined') {
    throw new Error('The parameter must not be undefined');
  }
  if (typeof graves !== 'object') {
    throw new Error('The parameter must be an object');
  }
  const keys = Object.keys(graves);
  keys.forEach((k) => {
    const value = graves[k];
    if (typeof value === 'undefined') {
      throw new Error('The values of the keys of the parameter must not be undefined');
    }
    if (typeof value !== 'function' && typeof value !== 'object') {
      throw new Error('The value to the keys in the parameter object must be' +
        'either a grave (Object) or a zombie (function)');
    }
  });
  return {
    ...graves
  }
};


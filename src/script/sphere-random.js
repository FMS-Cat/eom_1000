import xorshift from './xorshift';

let sphereRandom = function( _size ) {
  let len = _size * 4;
  let ret = new Float32Array( len );

  for ( let iPix = 0; iPix < len / 4; iPix ++ ) {
    let x = 1.0;
    let y = 1.0;
    let z = 1.0;

    while ( 1.0 < x * x + y * y + z * z ) {
      x = xorshift() * 2.0 - 1.0;
      y = xorshift() * 2.0 - 1.0;
      z = xorshift() * 2.0 - 1.0;
    }

    ret[ iPix * 4 + 0 ] = x;
    ret[ iPix * 4 + 1 ] = y;
    ret[ iPix * 4 + 2 ] = z;
    ret[ iPix * 4 + 3 ] = xorshift();
  }

  return ret;
};

export default sphereRandom;

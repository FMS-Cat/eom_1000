import xorshift from './xorshift';

let canvas = document.createElement( 'canvas' );
let canvasSize = 2048;
canvas.width = canvasSize;
canvas.height = canvasSize;

let context = canvas.getContext( '2d' );
context.textAlign = 'center';
context.textBaseline = 'middle';
context.font = '900 ' + canvasSize / 3.0 + 'px "Helvetica Neue", "Helvetica Neue OTS"';

context.fillStyle = '#000';
context.fillRect( 0, 0, canvasSize, canvasSize );

context.fillStyle = '#fff';
context.fillText( '1000', canvasSize / 2.0, canvasSize / 2.0 );

let imageData = context.getImageData( 0, 0, canvasSize, canvasSize ).data;

let testNemui = function( _x, _y ) {
  let x = _x;
  let y = _y;

  return 127 < imageData[ 4 * ( x + canvasSize * y ) ];
}

let hits = new Float32Array( canvasSize * canvasSize * 2 );
let head = 0;
for ( let iy = 0; iy < canvasSize; iy ++ ) {
  for ( let ix = 0; ix < canvasSize; ix ++ ) {
    if ( testNemui( ix, iy ) ) {
      hits[ head * 2 + 0 ] = ( ix / canvasSize ) * 2.0 - 1.0;
      hits[ head * 2 + 1 ] = -( iy / canvasSize ) * 2.0 + 1.0;
      head ++;
    }
  }
}

let word = function( _size ) {
  let out = new Float32Array( _size * 4 );
  for ( let iOut = 0; iOut < _size; iOut ++ ) {
    let dice = Math.floor( xorshift() * head );
    out[ iOut * 4 + 0 ] = hits[ dice * 2 + 0 ];
    out[ iOut * 4 + 1 ] = hits[ dice * 2 + 1 ];
    out[ iOut * 4 + 2 ] = ( xorshift() - 0.5 ) * 0.1;
    out[ iOut * 4 + 3 ] = xorshift();
  }
  return out;
};

export default word;

#define PI 3.14159265
#define V vec2(0.,1.)
#define saturate(i) clamp(i,0.,1.)

// ---

precision highp float;

uniform float time;
uniform float particleCountSqrt;
uniform bool frameZero;
uniform float deltaTime;

uniform sampler2D textureParticle;
uniform sampler2D textureRandom;
uniform sampler2D textureWord;
uniform sampler2D textureSphereRandom;

// ---

mat2 rotate2D( float _t ) {
  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );
}

vec3 rotateEuler( vec3 _p, vec3 _r ) {
  vec3 p = _p;
  p.yz = rotate2D( _r.x ) * p.yz;
  p.zx = rotate2D( _r.y ) * p.zx;
  p.xy = rotate2D( _r.z ) * p.xy;
  return p;
}

#pragma glslify: noise = require( ./noise )

// ---

void main() {
  vec2 reso = vec2( 4.0, 1.0 ) * particleCountSqrt;

  float type = mod( floor( gl_FragCoord.x ), 4.0 );
  vec2 uv = gl_FragCoord.xy;
  uv.x += -type + 1.5;
  uv /= reso;

  vec4 pos = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso );
  vec4 vel = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso );
  vec4 rot = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso );
  vec4 col = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso );

  if ( frameZero ) {
    vec4 posI = texture2D( textureWord, uv );
    pos = posI;
    pos.x -= 0.03;

    vel = 0.0 * texture2D( textureSphereRandom, uv );
    vel.w = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).w;

    vec4 rotI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso );

    // rot.xyz -= 0.5;
    float rotMax = max( max( abs( rot.x ), abs( rot.y ) ), abs( rot.z ) );
    if ( abs( rot.x ) == rotMax ) { rot.y = 0.0; rot.z = 0.0; }
    if ( abs( rot.y ) == rotMax ) { rot.z = 0.0; rot.x = 0.0; }
    if ( abs( rot.z ) == rotMax ) { rot.x = 0.0; rot.y = 0.0; }
    rot.w = 1.0;

    vec4 colI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso );
    col = colI;

    col.xyz -= 0.5;
    float colMax = max( max( abs( col.x ), abs( col.y ) ), abs( col.z ) );
    if ( abs( col.x ) == colMax ) { col.y = 0.0; col.z = 0.0; }
    if ( abs( col.y ) == colMax ) { col.z = 0.0; col.x = 0.0; }
    if ( abs( col.z ) == colMax ) { col.x = 0.0; col.y = 0.0; }

    col.w = pow( col.w, 40.0 ) * 0.04;
  }

  if ( time < 0.5 ) {
    rot.xyz *= exp( -deltaTime * 6.0 );
    rot.w *= exp( -deltaTime * 6.0 );

    if ( 0.2 < time ) {
      col.xyz *= exp( -deltaTime * 6.0 );
      col.w = mix(
        0.01,
        col.w,
        exp( -deltaTime * 6.0 )
      );
    }
  } else {
    float speedMul = time < 0.65 ? 0.4 : 0.1 + pow( ( time - 0.45 ) * 3.0, 2.0 );
    float speedMul2 = time < 0.65 ? 0.7 : 0.1;

    pos += vel * speedMul2 * deltaTime;
    pos.w *= exp( -deltaTime * speedMul * 2.0 );
    pos.yz = rotate2D( speedMul2 * deltaTime * -6.0 ) * pos.yz;

    vel.xyz += vec3(
      noise( vec4( pos.xyz * 3.0, 55.16 ) ),
      noise( vec4( pos.xyz * 3.0, 66.12 ) ),
      noise( vec4( pos.xyz * 3.0, 33.43 ) )
    ) * speedMul2 * 9.0 * deltaTime;
    vel.yz = rotate2D( speedMul * deltaTime * -6.0 ) * vel.yz;

    vel.xyz += -pos.xyz * speedMul2 * 1.0 * deltaTime;

    vel *= exp( -deltaTime );

    rot.zw = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).zw - 0.5;
    rot.xy += rot.zw * deltaTime;
  }

  vec4 ret;
  if ( type == 0.0 ) {
    ret = pos;
  } else if ( type == 1.0 ) {
    ret = vel;
  } else if ( type == 2.0 ) {
    ret = rot;
  } else if ( type == 3.0 ) {
    ret = col;
  }

  gl_FragColor = ret;
}

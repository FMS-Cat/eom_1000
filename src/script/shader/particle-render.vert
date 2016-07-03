#define PI 3.14159265
#define V vec2(0.,1.)

// ---

attribute vec3 uv;

varying vec3 vPos;
varying vec3 vCol;
varying vec3 vNormal;
varying float vVelw;
varying float vLightDist;
varying vec2 vTextureShadowCoord;

uniform float time;
uniform vec2 resolution;
uniform float particleCountSqrt;
uniform vec3 u_cameraPos;
uniform vec3 u_lightPos;

uniform sampler2D textureParticle;
uniform sampler2D textureCube;

// ---

mat4 lookAt( vec3 _pos, vec3 _tar, vec3 _air ) {
  vec3 dir = normalize( _tar - _pos );
  vec3 sid = normalize( cross( dir, _air ) );
  vec3 top = normalize( cross( sid, dir ) );
  return mat4(
    sid.x, top.x, dir.x, 0.0,
    sid.y, top.y, dir.y, 0.0,
    sid.z, top.z, dir.z, 0.0,
    - sid.x * _pos.x - sid.y * _pos.y - sid.z * _pos.z,
    - top.x * _pos.x - top.y * _pos.y - top.z * _pos.z,
    - dir.x * _pos.x - dir.y * _pos.y - dir.z * _pos.z,
    1.0
  );
}

mat4 perspective( float _fov, float _aspect, float _near, float _far ) {
  float p = 1.0 / tan( _fov * PI / 180.0 / 2.0 );
  float d = _far / ( _far - _near );
  return mat4(
    p / _aspect, 0.0, 0.0, 0.0,
    0.0, p, 0.0, 0.0,
    0.0, 0.0, d, 1.0,
    0.0, 0.0, -_near * d, 0.0
  );
}

mat2 rotate2D( float _theta ) {
  return mat2( cos( _theta ), sin( _theta ), -sin( _theta ), cos( _theta ) );
}

#pragma glslify: noise = require( ./noise )

// ---

void main() {
  vec4 pos = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 0.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );
  vec4 vel = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 1.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );
  vec4 rot = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 2.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );
  vec4 col = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 3.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );

  mat4 matP = perspective( 40.0, resolution.x / resolution.y, 0.01, 100.0 );
  vec3 cameraPos = u_cameraPos;
  mat4 matV = lookAt( cameraPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) );

  vec3 cubeVert = texture2D( textureCube, vec2( 0.5 / 2.0, ( uv.z + 0.5 ) / 36.0 ) ).xyz;
  cubeVert.yz = rotate2D( rot.x ) * cubeVert.yz;
  cubeVert.zx = rotate2D( rot.y ) * cubeVert.zx;

  float size = pos.w;
  size *= time < 0.5 ? ( 1.0 - rot.w ) : 1.0;
  size *= col.w;
  pos.xyz += cubeVert * size;
  pos.xyz += time < 0.5 ? rot.xyz : V.xxx;
  pos.xyz += col.xyz;

  float startRot = exp( -max( 0.0, time - 0.2 ) * 20.0 );
  float endRot = 1.0 - exp( -max( 0.0, time - 0.5 ) * 20.0 );
  pos.xy = rotate2D( -startRot * PI / 4.0 ) * pos.xy;
  pos.z += startRot * 0.5;
  pos.xy = rotate2D( endRot * 0.4 ) * pos.xy;
  pos.zx = rotate2D( endRot * 0.4 ) * pos.zx;

  vNormal = texture2D( textureCube, vec2( 1.5 / 2.0, ( uv.z + 0.5 ) / 36.0 ) ).xyz;
  vNormal.yz = rotate2D( rot.x ) * vNormal.yz;
  vNormal.zx = rotate2D( rot.y ) * vNormal.zx;
  vNormal = ( matV * vec4( vNormal, 0.0 ) ).xyz;

  gl_Position = (
    matP
    * matV
    * vec4( pos.xyz, 1.0 )
  );

  vec4 posFromLight = (
    matP
    * lookAt( u_lightPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) )
    * vec4( pos.xyz, 1.0 )
  );
  vTextureShadowCoord = posFromLight.xy / posFromLight.w;

  vLightDist = length( u_lightPos - pos.xyz );
  vPos = pos.xyz;
  vCol = col.xyz;
  vVelw = vel.w;
}

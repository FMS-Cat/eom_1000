#define PI 3.14159265
#define saturate(i) clamp(i,0.,1.)
#define V vec2(0.,1.)

#define SHADOW_EPSILON 0.04

// ---

precision highp float;

varying vec3 vPos;
varying vec3 vCol;
varying vec3 vNormal;
varying float vLightDist;
varying vec2 vTextureShadowCoord;

uniform vec2 resolution;
uniform vec3 u_cameraPos;
uniform vec3 u_lightPos;

uniform sampler2D textureShadow;

// ---

void main() {
  float dist = length( u_cameraPos - vPos );
  float decay = exp( -dist * 4E-2 );
  vec3 ligDir = normalize( vPos - u_lightPos );
  float dif = saturate( dot( vNormal, ligDir ) ) * 0.9 + 0.1;

  float shadow = 1.0;
  vec4 proj = texture2D( textureShadow, vTextureShadowCoord.xy * 0.5 + 0.5 );
  if ( proj.y < 0.5 && proj.x + SHADOW_EPSILON < vLightDist ) {
    shadow = 0.7;
  }

  gl_FragColor = vec4( mix(
    V.xxx,
    V.yyy * dif * shadow,
    decay
  ), 1.0 );
}

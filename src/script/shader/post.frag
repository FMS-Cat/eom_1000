#define V vec2(0.,1.)

#define PI 3.14159265

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform sampler2D textureRandom;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec3 rnd = texture2D( textureRandom, floor( uv * V.yy * 120.0 ) / 120.0 * V.xy ).xyz;

  vec3 ret = V.xxx;

  float amp = 0.3 * pow( max( 0.0, time - 0.6 ), 2.0 );
  ret.x = texture2D( texture, uv + V.yx * sin( time + rnd.x * 190.0 ) * amp ).x;
  ret.y = texture2D( texture, uv + V.yx * sin( time + rnd.y * 190.0 ) * amp ).y;
  ret.z = texture2D( texture, uv + V.yx * sin( time + rnd.z * 190.0 ) * amp ).z;

  ret *= 1.0 - length( uv - 0.5 ) * 0.2;

  gl_FragColor = vec4( ret, 1.0 );
}

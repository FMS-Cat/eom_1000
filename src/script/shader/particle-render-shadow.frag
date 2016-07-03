#define PI 3.14159265
#define saturate(i) clamp(i,0.,1.)
#define V vec2(0.,1.)

// ---

precision highp float;

varying float vLightDist;

// ---

void main() {
  gl_FragColor = vec4(
    vLightDist,
    0.0,
    0.0,
    1.0
  );
}

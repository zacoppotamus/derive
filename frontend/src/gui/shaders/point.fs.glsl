precision highp float;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform vec3 position;
uniform vec4 color;

void main() {
  float border = 0.1;
  float radius = 0.5;
  float dist = radius - distance(gl_PointCoord, vec2(0.5));
  float t = smoothstep(0.0, border, dist);

  if (distance(gl_PointCoord, vec2(0.5, .5)) > .5)
    discard;
  float bla = snoise3(position);

  gl_FragColor = color;
}
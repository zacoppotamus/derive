precision highp float;

uniform float size;

uniform vec3 position;
uniform mat4 view, projection;

void main() {
  vec4 mvPosition = view * vec4(position, 1.);

  // gl_PointSize = size + (1000.0 / -mvPosition.z);
  gl_PointSize = size + (1000.0 / (-mvPosition.z * 1.5));
  // gl_Position = projection * view * vec4(position, 1.);
  gl_Position = projection * mvPosition;
}
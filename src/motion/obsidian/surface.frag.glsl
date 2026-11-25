precision highp float;
uniform vec2 resolution;
uniform vec2 origin;
uniform float time, amplitude, damping, reflection, width, duration;

// A travelling wave packet. Its analytic radial derivative tilts the reflected light.
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 point = (uv - origin) * resolution / min(resolution.x, resolution.y);
  float radius = length(point);
  vec2 farCorner = max(origin, 1.0 - origin) * resolution / min(resolution.x, resolution.y);
  float progress = clamp(time / duration, 0.0, 1.0);
  float travel = length(farCorner) + 4.0 * width;
  // The slope of one Gaussian crest lights its leading face and shades its trailing face.
  float offset = (radius - progress * travel) / width;
  float slope = amplitude * offset * exp(-0.5 * offset * offset - damping * progress);
  slope *= smoothstep(0.0, 0.12, time);
  vec2 normal = slope * point / max(0.025, radius);
  float facet = dot(normal, vec2(-0.78, 0.62));
  float reflectionBand = exp(-1.7 * abs(dot(point + normal * 0.65, vec2(0.4, 0.92)) - 0.13));
  float light = reflection * facet * (0.62 + reflectionBand);
  vec3 tint = mix(vec3(0.01,0.013,0.018), vec3(0.70,0.72,0.79), step(0.0,light));
  gl_FragColor = vec4(tint, clamp(abs(light), 0.0, 0.68));
}


import fragment from './surface.frag.glsl?raw';
import type { Ripple } from './material';

const vertex = 'attribute vec2 position; void main(){ gl_Position = vec4(position, 0.0, 1.0); }';

export function createRenderer(canvas: HTMLCanvasElement, config: Ripple) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: false });
  if (!gl) return null;
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const shaders: WebGLShader[] = [];
  const dispose = () => {
    shaders.forEach(shader => gl.deleteShader(shader));
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
  };
  try {
    if (!program || !buffer) throw new Error('Unavailable WebGL resources');
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Unavailable shader');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Material program could not link');
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    for (const key of ['amplitude','damping','reflection','width','duration'] as const) {
      gl.uniform1f(uniform(key), config[key]);
    }
    gl.uniform2f(uniform('origin'), ...config.origin);
    const resolution = uniform('resolution');
    const time = uniform('time');
    return {
      resize(width: number, height: number) {
        const ratio = Math.min(devicePixelRatio, config.pixelRatio, Math.sqrt(config.pixelBudget / Math.max(1, width * height)));
        canvas.width = Math.max(1, Math.round(width * ratio));
        canvas.height = Math.max(1, Math.round(height * ratio));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
      },
      draw(seconds: number) { gl.uniform1f(time, seconds); gl.drawArrays(gl.TRIANGLES, 0, 3); },
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}


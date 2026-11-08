import { ShaderMaterial, Texture, Vector2 } from 'three';

/**
 * Materiał kafla: miniatura, a po najechaniu w siatce płynne przejście do pełnego zrzutu
 * strony przesuwanego w dół (podgląd) oraz falowanie jak tkanina (wierzchołki).
 */
export function stworzMaterial(mapa: Texture): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
      uMap: { value: mapa },
      uPelna: { value: mapa },
      uF: { value: 1 }, // wysokość okna podglądu jako ułamek pełnego zrzutu
      uMix: { value: 0 },
      uPrzesuw: { value: 0 },
      uAlpha: { value: 1 },
      uCzas: { value: 0 },
      uAmp: { value: 0 },
      uWiatr: { value: 0 },
      uJasnosc: { value: 0 },
      uPunkt: { value: new Vector2(0.5, 0.5) },
    },
    vertexShader: /* glsl */ `
      uniform float uCzas;
      uniform float uAmp;
      uniform float uWiatr;
      uniform vec2 uPunkt;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        // fala od kursora, gasnąca z odległością
        float d = distance(uv, uPunkt);
        p.z += sin(d * 14.0 - uCzas * 6.5) * uAmp * exp(-d * 3.2);
        // delikatny wiatr w stanie siatki
        p.z += sin(uv.x * 5.0 + uCzas * 1.1) * sin(uv.y * 4.0 + uCzas * 0.7) * 0.016 * uWiatr;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform sampler2D uPelna;
      uniform float uF;
      uniform float uMix;
      uniform float uPrzesuw;
      uniform float uAlpha;
      uniform float uJasnosc;
      varying vec2 vUv;
      void main() {
        vec4 a = texture2D(uMap, vUv);
        float o = uPrzesuw * (1.0 - uF);
        float v = 1.0 - (o + (1.0 - vUv.y) * uF);
        vec4 b = texture2D(uPelna, vec2(vUv.x, v));
        gl_FragColor = mix(a, b, uMix);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), uJasnosc);
        gl_FragColor.a *= uAlpha;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

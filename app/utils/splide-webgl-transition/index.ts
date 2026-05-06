import gsap from 'gsap';
import { Vector2, type IUniform } from 'three';
import type {
  WebGLTransitionOptions,
  EffectType,
  CachedTexture,
} from './types';
import { SplideWebGLRenderer } from './renderer';
import { getEffectIndex } from './shaders';
import { DEFAULT_GLOBAL_SETTINGS, getEffectParameters } from './effects';

type SlideComponent = { slide: HTMLElement };

type SplideInstance = {
  Components: {
    Elements: { track: HTMLElement; root: HTMLElement };
    Slides: { getAt(index: number): SlideComponent | undefined };
  };
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  index: number;
  root: HTMLElement;
};

export function WebGLTransition(
  splide: SplideInstance,
  _components: unknown,
  options: WebGLTransitionOptions = {},
) {
  const {
    effect = 'glass',
    preset = 'Default',
    duration = 1.0,
    globalSettings = {},
    effectParameters = {},
    debug = false,
    zIndex = 10,
    enableTextureCache = true,
    maxPixelRatio = 2,
  } = options;

  const renderer = new SplideWebGLRenderer();
  let isTransitioning = false;
  let animationFrameId: number | null = null;
  let activeMaterial: ReturnType<SplideWebGLRenderer['createShaderMaterial']> | null = null;
  let currentTween: gsap.core.Tween | null = null;

  const log = (...args: unknown[]) => {
    if (debug) console.log('[WebGLTransition]', ...args);
  };

  function getSlideImageUrl(index: number): string | null {
    try {
      const slide = splide.Components.Slides.getAt(index);
      if (!slide) return null;
      const img = slide.slide.querySelector('img');
      return img?.currentSrc || img?.src || null;
    } catch (e) {
      log('getSlideImageUrl error', e);
      return null;
    }
  }

  function preloadAllTextures(): Promise<void> {
    const urls = new Set<string>();
    for (let i = 0; ; i++) {
      const slide = splide.Components.Slides.getAt(i);
      if (!slide) break;
      const url = getSlideImageUrl(i);
      if (url) urls.add(url);
    }
    return Promise.all(Array.from(urls).map((url) => renderer.loadTexture(url)))
      .then(() => log('preloaded', urls.size, 'textures'))
      .catch((e) => log('preload error', e));
  }

  function handleMounted() {
    log('Splide mounted');
    const track = splide.Components.Elements.track;
    if (!track) {
      log('No track element found');
      return;
    }
    renderer.initialize(track, maxPixelRatio, enableTextureCache);
    renderer.attach(zIndex);
    preloadAllTextures();
  }

  function handleMove(newIndex: number, prevIndex: number) {
    if (isTransitioning) {
      log('skip - already transitioning');
      return;
    }
    const fromUrl = getSlideImageUrl(prevIndex);
    const toUrl = getSlideImageUrl(newIndex);
    if (!fromUrl || !toUrl || fromUrl === toUrl) return;

    const fromCached = renderer.getCachedTexture(fromUrl);
    const toCached = renderer.getCachedTexture(toUrl);

    isTransitioning = true;

    if (fromCached && toCached) {
      // Sync fast path — runs in same task as Splide's DOM swap, so the
      // canvas is composited on top before the browser repaints.
      startTransition(fromCached, toCached);
    } else {
      // Cache miss fallback (should be rare after preload).
      Promise.all([renderer.loadTexture(fromUrl), renderer.loadTexture(toUrl)])
        .then(([from, to]) => startTransition(from, to))
        .catch((e) => {
          console.error('[WebGLTransition] transition error', e);
          isTransitioning = false;
        });
    }
  }

  function startTransition(from: CachedTexture, to: CachedTexture) {
    const uniforms = createUniforms(from, to);
    activeMaterial = renderer.createShaderMaterial(uniforms);
    renderer.setupScene(activeMaterial);
    // Render the first frame (progress=0 → old image) BEFORE showing canvas,
    // so revealing it never exposes an empty/transparent buffer.
    renderer.render();
    renderer.setVisibility(true);

    startRenderLoop();

    currentTween = gsap.to(activeMaterial.uniforms.uProgress, {
      value: 1,
      duration,
      ease: 'power2.inOut',
      onComplete: finishTransition,
    });
  }

  function finishTransition() {
    stopRenderLoop();
    renderer.setVisibility(false);
    if (activeMaterial) {
      activeMaterial.dispose();
      activeMaterial = null;
    }
    currentTween = null;
    isTransitioning = false;
  }

  function createUniforms(from: CachedTexture, to: CachedTexture): Record<string, IUniform> {
    const merged = { ...DEFAULT_GLOBAL_SETTINGS, ...globalSettings };
    const params = getEffectParameters(effect as EffectType, preset, effectParameters);

    return {
      uTexture1: { value: from.texture },
      uTexture2: { value: to.texture },
      uProgress: { value: 0 },
      uResolution: { value: renderer.getResolution() },
      uTexture1Size: { value: new Vector2(from.size.width, from.size.height) },
      uTexture2Size: { value: new Vector2(to.size.width, to.size.height) },
      uEffectType: { value: getEffectIndex(effect) },

      uGlobalIntensity: { value: merged.globalIntensity },
      uSpeedMultiplier: { value: merged.speedMultiplier },
      uDistortionStrength: { value: merged.distortionStrength },
      uColorEnhancement: { value: merged.colorEnhancement },

      uGlassRefractionStrength: { value: params.glassRefractionStrength ?? 1.0 },
      uGlassChromaticAberration: { value: params.glassChromaticAberration ?? 1.0 },
      uGlassBubbleClarity: { value: params.glassBubbleClarity ?? 1.0 },
      uGlassEdgeGlow: { value: params.glassEdgeGlow ?? 1.0 },
      uGlassLiquidFlow: { value: params.glassLiquidFlow ?? 1.0 },

      uFrostIntensity: { value: params.frostIntensity ?? 1.5 },
      uFrostCrystalSize: { value: params.frostCrystalSize ?? 1.0 },
      uFrostIceCoverage: { value: params.frostIceCoverage ?? 1.0 },
      uFrostTemperature: { value: params.frostTemperature ?? 1.0 },
      uFrostTexture: { value: params.frostTexture ?? 1.0 },

      uRippleFrequency: { value: params.rippleFrequency ?? 25.0 },
      uRippleAmplitude: { value: params.rippleAmplitude ?? 0.08 },
      uRippleWaveSpeed: { value: params.rippleWaveSpeed ?? 1.0 },
      uRippleRippleCount: { value: params.rippleRippleCount ?? 1.0 },
      uRippleDecay: { value: params.rippleDecay ?? 1.0 },

      uPlasmaIntensity: { value: params.plasmaIntensity ?? 1.2 },
      uPlasmaSpeed: { value: params.plasmaSpeed ?? 0.8 },
      uPlasmaEnergyIntensity: { value: params.plasmaEnergyIntensity ?? 0.4 },
      uPlasmaContrastBoost: { value: params.plasmaContrastBoost ?? 0.3 },
      uPlasmaTurbulence: { value: params.plasmaTurbulence ?? 1.0 },

      uTimeshiftDistortion: { value: params.timeshiftDistortion ?? 1.6 },
      uTimeshiftBlur: { value: params.timeshiftBlur ?? 1.5 },
      uTimeshiftFlow: { value: params.timeshiftFlow ?? 1.4 },
      uTimeshiftChromatic: { value: params.timeshiftChromatic ?? 1.5 },
      uTimeshiftTurbulence: { value: params.timeshiftTurbulence ?? 1.4 },
    };
  }

  function startRenderLoop() {
    const tick = () => {
      if (activeMaterial) {
        const res = renderer.getResolution();
        const u = activeMaterial.uniforms.uResolution.value as Vector2;
        u.copy(res);
      }
      renderer.render();
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
  }

  function stopRenderLoop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function mount() {
    log('mount');
    splide.on('mounted', handleMounted);
    splide.on('move', handleMove);
  }

  function destroy() {
    log('destroy');
    splide.off('mounted', handleMounted);
    splide.off('move', handleMove);

    currentTween?.kill();
    currentTween = null;
    stopRenderLoop();

    if (activeMaterial) {
      activeMaterial.dispose();
      activeMaterial = null;
    }

    isTransitioning = false;
    renderer.dispose();
  }

  return { mount, destroy };
}

export const createWebGLTransition = (options: WebGLTransitionOptions = {}) => {
  return (splide: SplideInstance, components: unknown) =>
    WebGLTransition(splide, components, options);
};

export type {
  EffectType,
  EffectPresetMap,
  GlobalSettings,
  EffectParameters,
  WebGLTransitionOptions,
} from './types';
export { EFFECT_PRESETS } from './effects';

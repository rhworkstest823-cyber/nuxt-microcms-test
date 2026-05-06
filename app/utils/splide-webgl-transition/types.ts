import type { Texture } from 'three';

export type EffectType = 'glass' | 'frost' | 'ripple' | 'plasma' | 'timeshift';

export type EffectPresetMap = {
  glass: 'Subtle' | 'Default' | 'Crystal' | 'Liquid';
  frost: 'Light' | 'Default' | 'Heavy' | 'Arctic';
  ripple: 'Gentle' | 'Default' | 'Strong' | 'Tsunami';
  plasma: 'Calm' | 'Default' | 'Storm' | 'Nuclear';
  timeshift: 'Subtle' | 'Default' | 'Intense' | 'Dreamlike';
};

export interface GlobalSettings {
  globalIntensity: number;
  speedMultiplier: number;
  distortionStrength: number;
  colorEnhancement: number;
}

export interface EffectParameters {
  glassRefractionStrength?: number;
  glassChromaticAberration?: number;
  glassBubbleClarity?: number;
  glassEdgeGlow?: number;
  glassLiquidFlow?: number;

  frostIntensity?: number;
  frostCrystalSize?: number;
  frostIceCoverage?: number;
  frostTemperature?: number;
  frostTexture?: number;

  rippleFrequency?: number;
  rippleAmplitude?: number;
  rippleWaveSpeed?: number;
  rippleRippleCount?: number;
  rippleDecay?: number;

  plasmaIntensity?: number;
  plasmaSpeed?: number;
  plasmaEnergyIntensity?: number;
  plasmaContrastBoost?: number;
  plasmaTurbulence?: number;

  timeshiftDistortion?: number;
  timeshiftBlur?: number;
  timeshiftFlow?: number;
  timeshiftChromatic?: number;
  timeshiftTurbulence?: number;
}

export interface WebGLTransitionOptions {
  effect?: EffectType;
  preset?: string;
  duration?: number;
  globalSettings?: Partial<GlobalSettings>;
  effectParameters?: EffectParameters;
  debug?: boolean;
  zIndex?: number;
  enableTextureCache?: boolean;
  maxPixelRatio?: number;
}

export interface CachedTexture {
  texture: Texture;
  size: { width: number; height: number };
  timestamp: number;
}

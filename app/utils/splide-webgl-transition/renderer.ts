import {
  WebGLRenderer as ThreeWebGLRenderer,
  Scene,
  OrthographicCamera,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Texture,
  LinearFilter,
  Vector2,
  Material,
  type IUniform,
} from 'three';
import type { CachedTexture } from './types';
import { vertexShader, fragmentShader } from './shaders';

const MAX_CACHE_SIZE = 50;
const MAX_CACHE_AGE_MS = 30_000;
const IMAGE_LOAD_TIMEOUT_MS = 10_000;

export class SplideWebGLRenderer {
  private renderer: ThreeWebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: OrthographicCamera | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private container: HTMLElement | null = null;
  private mesh: Mesh | null = null;

  private textureCache: Map<string, CachedTexture> = new Map();
  private maxPixelRatio: number = 2;
  private enableCache: boolean = true;

  private resizeObserver: ResizeObserver | null = null;
  private resolution: Vector2 = new Vector2(1, 1);

  initialize(container: HTMLElement, maxPixelRatio = 2, enableCache = true): void {
    if (this.renderer) return;

    this.container = container;
    this.maxPixelRatio = maxPixelRatio;
    this.enableCache = enableCache;

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0;
    `;

    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderer = new ThreeWebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const computedStyle = window.getComputedStyle(container);
    if (computedStyle.position === 'static') {
      container.style.position = 'relative';
    }

    container.appendChild(this.canvas);

    this.updateSize();

    this.resizeObserver = new ResizeObserver(() => this.updateSize());
    this.resizeObserver.observe(container);
  }

  attach(zIndex = 10): void {
    if (this.canvas) {
      this.canvas.style.zIndex = zIndex.toString();
    }
  }

  setVisibility(visible: boolean): void {
    if (this.canvas) {
      this.canvas.style.opacity = visible ? '1' : '0';
    }
  }

  getCachedTexture(url: string): CachedTexture | null {
    if (!this.enableCache) return null;
    const cached = this.textureCache.get(url);
    if (!cached) return null;
    cached.timestamp = Date.now();
    return cached;
  }

  async loadTexture(url: string): Promise<CachedTexture> {
    if (this.enableCache) {
      const cached = this.textureCache.get(url);
      if (cached) {
        cached.timestamp = Date.now();
        return cached;
      }
    }

    const image = await this.loadImageWithCors(url);

    const texture = new Texture(image);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const cached: CachedTexture = {
      texture,
      size: { width: image.naturalWidth, height: image.naturalHeight },
      timestamp: Date.now(),
    };

    if (this.enableCache) {
      this.textureCache.set(url, cached);
      this.cleanupOldTextures();
    }

    return cached;
  }

  createShaderMaterial(uniforms: Record<string, IUniform>): ShaderMaterial {
    return new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }

  setupScene(material: ShaderMaterial): void {
    if (!this.scene) throw new Error('Renderer not initialized');

    this.disposeMesh();

    const geometry = new PlaneGeometry(2, 2);
    this.mesh = new Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  render(): void {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.renderer.render(this.scene, this.camera);
  }

  getResolution(): Vector2 {
    return this.resolution.clone();
  }

  dispose(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    for (const cached of this.textureCache.values()) {
      cached.texture.dispose();
    }
    this.textureCache.clear();

    this.disposeMesh();

    this.renderer?.dispose();

    if (this.canvas?.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.canvas = null;
    this.container = null;
  }

  private disposeMesh(): void {
    if (!this.scene || !this.mesh) return;

    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    if (this.mesh.material instanceof Material) {
      this.mesh.material.dispose();
    }
    this.mesh = null;
  }

  private loadImageWithCors(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Image load timeout: ${url}`));
      }, IMAGE_LOAD_TIMEOUT_MS);

      const cleanup = () => {
        clearTimeout(timer);
        image.removeEventListener('load', onLoad);
        image.removeEventListener('error', onError);
      };

      const onLoad = () => {
        cleanup();
        resolve(image);
      };
      const onError = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${url}`));
      };

      image.addEventListener('load', onLoad);
      image.addEventListener('error', onError);
      image.src = url;
    });
  }

  private updateSize(): void {
    if (!this.renderer || !this.container || !this.canvas) return;

    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.maxPixelRatio);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.resolution.set(width, height);
  }

  private cleanupOldTextures(): void {
    const now = Date.now();

    if (this.textureCache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(this.textureCache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );
      const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
      for (const [key, value] of toRemove) {
        value.texture.dispose();
        this.textureCache.delete(key);
      }
    }

    for (const [key, value] of this.textureCache.entries()) {
      if (now - value.timestamp > MAX_CACHE_AGE_MS) {
        value.texture.dispose();
        this.textureCache.delete(key);
      }
    }
  }
}

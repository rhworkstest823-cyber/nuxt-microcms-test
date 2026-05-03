import { createClient } from "microcms-js-sdk";
import { MICROCMS_ENDPOINTS } from './shared/lib/endpoints';

/**
 * 指定エンドポイントの全IDを取得してルート配列を返す
 * fields: 'id' のみ取得して軽量化
 */
const fetchAllRoutes = async (
  client: ReturnType<typeof createClient>,
  endpoint: string,
  prefix: string,
): Promise<string[]> => {
  const { contents } = await client.getList({
    endpoint,
    queries: { fields: 'id' },
  });
  return contents.map((item) => `${prefix}/${item.id}`);
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~/assets/scss/main.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/scss/global/_index.scss" as *;
          @use "@/assets/scss/foundation/_color.scss" as clr;
          @use "@/assets/scss/foundation/_stacking.scss" as zid;
          @use "@/assets/scss/foundation/_easing.scss" as ease;
          `
        }
      }
    }
  },
  runtimeConfig: {
    microCmsServiceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
    microCmsApiKey: process.env.MICROCMS_API_KEY,
    public: { // ブラウザからもアクセス可能。APIキーは絶対に入れない
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: await (async () => {
        const client = createClient({
          serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
          apiKey: process.env.MICROCMS_API_KEY!,
        });

        const [newsRoutes, businessRoutes] = await Promise.all([
          fetchAllRoutes(client, MICROCMS_ENDPOINTS.NEWS, '/news'),
          fetchAllRoutes(client, MICROCMS_ENDPOINTS.BUSINESS, '/business'),
        ]);

        return [
          '/', // トップページ
          '/news',
          ...newsRoutes,
          ...businessRoutes,
        ];
      })(),
    }
  }
})

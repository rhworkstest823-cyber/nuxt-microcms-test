/**
 * microCMS エンドポイント
 *
 */
export const MICROCMS_ENDPOINTS = {
  FRONT_PAGE: 'front_page',
  NEWS: 'news',
  NEWS_CATEGORY: 'news_category',
  BUSINESS: 'business',
  BUSINESS_CATEGORY: 'business_category',
} as const satisfies Record<string, string>;

export type MicroCMSEndpoint = typeof MICROCMS_ENDPOINTS[keyof typeof MICROCMS_ENDPOINTS];

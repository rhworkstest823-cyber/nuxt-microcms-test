import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from 'microcms-js-sdk'
import type { MicroCMSImage, MicroCMSListResponse } from "microcms-js-sdk";
import type { News, NewsCategory, Business, BusinessCategory } from '#shared/types/microcms';
import { MICROCMS_ENDPOINTS } from '#shared/lib/endpoints';

export const useMicrocms = () => {
  const config = useRuntimeConfig();

  // microCMSクライアント
  const client = createClient({
    serviceDomain: config.microCmsServiceDomain as string,
    apiKey: config.microCmsApiKey as string,
  });

  // お知らせ一覧 ----------------------------------
  const getNewsList = (queries?: MicroCMSQueries) => {
    const response = client.getList<News>({
      endpoint: MICROCMS_ENDPOINTS.NEWS,
      queries,
    });
    return response;
  };

  // お知らせ詳細 ----------------------------------
  const getNewsDetail = (id: string, queries?: MicroCMSQueries) => {
    const response = client.getListDetail<News>({
      endpoint: MICROCMS_ENDPOINTS.NEWS,
      contentId: id,
      queries,
    });
    return response;
  };

  // 事例一覧 ----------------------------------
  const getBusinessCategoryList = () => {
    const response = client.getList<BusinessCategory>({
      endpoint: MICROCMS_ENDPOINTS.BUSINESS_CATEGORY,
    });
    return response;
  };

  const getBusinessList = (queries?: MicroCMSQueries) => {
    const response = client.getList<Business>({
      endpoint: MICROCMS_ENDPOINTS.BUSINESS,
      queries,
    });
    return response;
  };

  // 事例詳細 ----------------------------------
  const getBusinessDetail = (id: string, queries?: MicroCMSQueries) => {
    const response = client.getListDetail<Business>({
      endpoint: MICROCMS_ENDPOINTS.BUSINESS,
      contentId: id,
      queries,
    });
    return response;
  };

  return {
    getNewsList,
    getNewsDetail,
    getBusinessCategoryList,
    getBusinessList,
    getBusinessDetail,
  };
};

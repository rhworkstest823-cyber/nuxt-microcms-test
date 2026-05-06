import type {
  MicroCMSImage,
  MicroCMSContentId,
  MicroCMSDate,
  MicroCMSListResponse,
  MicroCMSListContent,
  MicroCMSObjectContent,
} from 'microcms-js-sdk'

// お知らせ ----------------------------------
export type NewsCategory = Record<string, string>;

export type News = MicroCMSListContent & {
  title: string
  category: NewsCategory
  datetime: string // 日付フィールド（ISO8601文字列）
  keyVisual: MicroCMSImage[] // 画像（複数）
  content: string
}

// お知らせ一覧 ----------------------------------
export type NewsListResponse = MicroCMSListResponse<News>

// 事例 ----------------------------------
export type BusinessCategory = Record<string, string>;

// リンク一覧
export type DetailLink = {
  fieldId: 'detailLink'
  url: string
  label: string
  isBlank: boolean
}

// ポイント一覧
export type Point = {
  fieldId: 'point'
  text: string
}

// 概要一覧
export type Outline = {
  fieldId: 'outline'
  outlineTitle: string
  outlineDescription: string
}

// Google マップ
export type GoogleMap = {
  fieldId: 'googleMap'
  mapEmbedUrl: string
  mapLink: string
}

// 事例コンテンツ
export type Business = MicroCMSListContent & {
  title: string
  category: BusinessCategory
  keyVisual: MicroCMSImage[] // 画像（複数）
  tag: string[]
  copyText: string
  description: string
  linkList: DetailLink[]
  pointList: Point[]
  outlineList: Outline[]
  googleMap: GoogleMap
}

// 事例一覧 ----------------------------------
export type BusinessListResponse = MicroCMSListResponse<Business>


// トップページ ----------------------------------
export type FrontPage = MicroCMSListContent & {
  keyVisual: MicroCMSImage[] // 画像（複数）
  business: Business[] // ピックアップした事例リスト
};

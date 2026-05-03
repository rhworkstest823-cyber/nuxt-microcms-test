export const usePageSeoMeta = (title: string, description: string) => {
  useSeoMeta({
    title: `${title} | サイト名`,
    description: description,
    ogTitle: `${title} | サイト名`,
    ogDescription: description,
    ogImage: '/ogp.png',
    twitterCard: 'summary_large_image',
  })
}

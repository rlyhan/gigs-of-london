export const proxiedImageSrc = (imageUrl: string, width: number) => `/api/image-proxy?url=${encodeURIComponent(imageUrl)}&width=${width}`

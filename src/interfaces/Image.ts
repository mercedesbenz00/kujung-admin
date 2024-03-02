export interface IImage {
  id?: number
  image_url: string
}

export interface IUploadedImage {
  Location: string
}

export const getMergedImages = (originalImages: IImage[], uploadedImages: IUploadedImage[]): IImage[] => {
  return [...originalImages, ...uploadedImages.map((it) => ({ id: undefined, image_url: it.Location }))]
}

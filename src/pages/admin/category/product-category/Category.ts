import { IImage } from '../../../../interfaces/Image'

export interface ICategory {
  id: string
  name: string
  parentId?: string
  depth: number
  image_url: string
  categoryImages: IImage[]
  desc: string
  tags: string
  categoryYoutubes: {
    id?: string
    title: string
    summary: string
    url: string
  }[]
  hidden: boolean
  children?: ICategory[]
  created_at: string
}

export const Depths = ['대분류', '중분류', '소분류']

export const isExistedCategory = (categories: ICategory[], category?: ICategory): boolean => {
  if (category === null || category === undefined) {
    return false
  }
  return categories.find((it) => it.id === category.id) !== undefined
}

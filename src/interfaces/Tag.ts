export interface ITag {
  id: string
  name: string
  priority: number
  display: boolean
  main_display: boolean
}

export const getTagsIds = (tags: ITag[]): number[] => {
  return tags.map((it) => Number(it.id))
}

export const getTagsNames = (tags: ITag[]): string => {
  return tags.map((it) => it.name).join(',')
}

export const getTagsFromAllTags = (allTags: ITag[], tags: ITag[]): ITag[] => {
  return tags
    .map((it) => {
      return allTags.find((v) => v.id === it.id)
    })
    .filter((it) => it !== undefined) as ITag[]
}

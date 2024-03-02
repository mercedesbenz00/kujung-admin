interface SearchKeywordTypos {
  id: number
  typos: string
}

export interface ISearchKeyword {
  id: string
  name: string
  searchKeywordTypos: SearchKeywordTypos[]
}

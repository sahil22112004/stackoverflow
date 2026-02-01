export interface QuestionQuery {
  search?: string
  tags?: string[] | string
  limit?: number | string
  offset?: number | string
  sortByScore?: boolean | string
  sortByNewest?: boolean | string
}

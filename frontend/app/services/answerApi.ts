const BASE_URL = 'http://localhost:4000'

export interface CreateAnswerPayload {
  questionId: string
  userId: string
  answer: string
  parentAnswerId?: string
}

export interface GetAnswersParams {
  limit?: number
  offset?: number
}

export const apiCreateAnswer = async (payload: CreateAnswerPayload) => {
  const res = await fetch(`${BASE_URL}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create answer')
  return data
}

export const apiGetAnswersForQuestion = async (
  questionId: string,
  params: GetAnswersParams = {}
) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, String(value))
  })

  const res = await fetch(
    `${BASE_URL}/answers/question/${questionId}?${query.toString()}`
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch answers')
  return data
}

export const apiGetRepliesForAnswer = async (parentAnswerId: string) => {
  const res = await fetch(
    `${BASE_URL}/answers/replies/${parentAnswerId}`
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch replies')
  return data
}

export const apiMarkValid = async(validData:any) =>{
  console.log('wrk vlid',JSON.stringify(validData))
  const res = await fetch(`${BASE_URL}/answers/markValid`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(validData),
  })
  const data = res;
  if (!res.ok) throw new Error('Failed to mark valid')
  return data
}

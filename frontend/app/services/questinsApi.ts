// const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const BASE_URL = "http://localhost:4000"

export interface CreateQuestionPayload {
  title: string
  description: string
  tags: string[]
  userId: string
  status: 'draft' | 'published'
}

export interface GetQuestionsParams {
  search?: string
  tags?: string[]
  limit?: number
  offset?: number
  sortByScore?: boolean
  sortByNewest?: boolean
}

export const apiCreateQuestion = async (question: CreateQuestionPayload) => {
  console.log("data when in api ",question)
  
  const res = await fetch(`${BASE_URL}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(question),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create question')
  return data
}

export const apiGetAllQuestions = async (params: GetQuestionsParams) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      query.append(key, value.join(','))
    } else if (value !== undefined) {
      query.append(key, String(value))
    }
  })

  const res = await fetch(`${BASE_URL}/questions?${query.toString()}`)
  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Failed to fetch questions')
  return data
}

export const apiGetQuestionById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/questions/${id}`)
  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Failed to fetch question')
  return data
}


export const apiGetAllTags = async () => {
  const res = await fetch(`${BASE_URL}/tags`, {
    method: 'GET',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch tags');
  return data;
};



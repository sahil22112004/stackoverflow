// const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const BASE_URL = 'http://localhost:4000'

export type VoteStatus = 'upvote' | 'downvote'
export type VoteTargetType = 'answer' | 'question'

export interface CreateVotePayload {
  targetId: string
  targetType: VoteTargetType
  userId: string
  status: VoteStatus
}

export const apiVote = async (payload: CreateVotePayload) => {
  const res = await fetch(`${BASE_URL}/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to vote')
  return data
}


export const apiGetUserVote = async (answerId: string, userId: string) => {
  const res = await fetch(
    `${BASE_URL}/votes/user?answerId=${answerId}&userId=${userId}`,
    {
      method: 'GET',
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user vote')
  return data
}

export const apiGetVoteCount = async (answerId: string) => {
  const res = await fetch(
    `${BASE_URL}/votes/count?answerId=${answerId}`,
    {
      method: 'GET',
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch vote count')
  return data
}

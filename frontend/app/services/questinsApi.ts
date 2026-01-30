const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export interface CreateQuestionPayload {
  title: string;
  description: string;
  tags: string[];
  userId: string;
  status: 'draft' | 'published';
}

export interface Tag {
  id: number;
  name: string;
}


export const apiCreateQuestion = async (question: CreateQuestionPayload) => {
  const res = await fetch(` http://localhost:4000/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(question),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create question');
  return data;
};

export const apiGetAllQuestions = async (params: any) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      query.append(key, value.join(','))
    } else if (value !== undefined) {
      query.append(key, String(value))
    }
  })

  const res = await fetch(` http://localhost:4000/questions?${query.toString()}`)
  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Failed to fetch questions')
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


export const apigetQuestionById = async (id:any) => {

  console.log('working')
  const res = await fetch(`${BASE_URL}/questions/${id}`, {
    method: 'GET',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch tags');
  return data;
};
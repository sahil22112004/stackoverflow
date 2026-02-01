import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiCreateQuestion,
  apiGetAllQuestions,
  CreateQuestionPayload,
} from '../../services/questinsApi'

export interface Question {
  id: number
  title: string
  description: string
  tags: string[]
  status: 'draft' | 'published'
  createdAt: string
  score: number
}

interface FetchParams {
  offset: number
  limit: number
  search?: string
  tags?: string[]
  sortByScore?: boolean
  sortByNewest?: boolean
}

interface QuestionState {
  questions: Question[]
  loading: boolean
  error: string | null
  hasMore: boolean
  offset: number
}

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
}

export const createQuestion = createAsyncThunk(
  'questions/create',
  async (payload: CreateQuestionPayload, { rejectWithValue }) => {
    console.log("data when in slice ",payload)
    try {
      return await apiCreateQuestion(payload)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchAllQuestions = createAsyncThunk(
  'questions/fetchAll',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      return await apiGetAllQuestions(params)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    resetQuestions: state => {
      state.questions = []
      state.offset = 0
      state.hasMore = true
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllQuestions.pending, state => {
        state.loading = true
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.loading = false

        const existingIds = new Set(state.questions.map(q => q.id))
        const unique = action.payload.questions.filter(
          (q: Question) => !existingIds.has(q.id)
        )

        state.questions.push(...unique)
        state.offset += unique.length
        state.hasMore = state.questions.length < action.payload.total
      })
      .addCase(fetchAllQuestions.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.payload
        state.hasMore = false
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload)
      })
  },
})

export const { resetQuestions } = questionSlice.actions
export default questionSlice.reducer

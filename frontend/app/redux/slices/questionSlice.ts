import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCreateQuestion, apiGetAllQuestions, CreateQuestionPayload } from '../../services/questinsApi'

export interface Question {
  id: number
  title: string
  description: string
  tags: string[]
  status: 'draft' | 'published'
  createdAt: string
}

interface FetchParams {
  offset: number
  limit: number
  search?: string
  tags?: string[]
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
  async (question: CreateQuestionPayload, { rejectWithValue }) => {
    try {
      return await apiCreateQuestion(question)
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
    resetQuestions: (state) => {
      state.questions = []
      state.offset = 0
      state.hasMore = true
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQuestions.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions.push(...action.payload.questions)
        state.offset += action.payload.questions.length
        state.hasMore = state.questions.length < action.payload.total
      })
      .addCase(fetchAllQuestions.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload)
      })
  },
})

export const { resetQuestions } = questionSlice.actions
export default questionSlice.reducer

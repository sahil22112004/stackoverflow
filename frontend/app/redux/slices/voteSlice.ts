import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiVote, CreateVotePayload } from '../../services/voteApi'

interface VoteState {
  loading: boolean
  error: string | null
}

const initialState: VoteState = {
  loading: false,
  error: null,
}

export const voteTarget = createAsyncThunk(
  'votes/vote',
  async (payload: CreateVotePayload, { rejectWithValue }) => {
    try {
      return await apiVote(payload)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const voteSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    resetVoteState: (state) => {
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(voteTarget.pending, (state) => {
        state.loading = true
      })
      .addCase(voteTarget.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(voteTarget.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { resetVoteState } = voteSlice.actions
export default voteSlice.reducer

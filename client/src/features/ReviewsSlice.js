import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {updateProfile} from './UserSlice';

const API="http://localhost:3003";

export const fetchReviews=createAsyncThunk("reviews/fetchReviews",async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get(`${API}/reviews`);
        return response.data;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to load reviews");
    }
});

export const addReview=createAsyncThunk("reviews/addReview",async(payload,{rejectWithValue})=>{
    try{
        const response=await axios.post(`${API}/reviews`,payload);
        return response.data.review;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to add review");
    }
});

export const updateReview=createAsyncThunk("reviews/updateReview",async({id,...rest},{rejectWithValue})=>{
    try{
        const response=await axios.put(`${API}/reviews/${id}`,rest);
        return response.data.review;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to update review");
    }
});

export const deleteReview=createAsyncThunk("reviews/deleteReview",async(id,{rejectWithValue})=>{
    try{
        await axios.delete(`${API}/reviews/${id}`);
        return id;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to delete review");
    }
});

export const deleteReviewsByBook=createAsyncThunk("reviews/deleteReviewsByBook",async(bookId,{rejectWithValue})=>{
    try{
        await axios.delete(`${API}/reviews/book/${bookId}`);
        return bookId;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to delete reviews");
    }
});

export const ReviewsSlice=createSlice({
    name:"reviews",
    initialState:{
        reviews:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchReviews.fulfilled,(state,action)=>{
            state.reviews=action.payload;
        })
        .addCase(addReview.fulfilled,(state,action)=>{
            state.reviews.unshift(action.payload);
        })
        .addCase(updateReview.fulfilled,(state,action)=>{
            state.reviews=state.reviews.map((r)=>r.id===action.payload.id?action.payload:r);
        })
        .addCase(deleteReview.fulfilled,(state,action)=>{
            state.reviews=state.reviews.filter((r)=>r.id!==action.payload);
        })
        .addCase(deleteReviewsByBook.fulfilled,(state,action)=>{
            state.reviews=state.reviews.filter((r)=>r.bookId!==action.payload);
        })
        .addCase(updateProfile.fulfilled,(state,action)=>{
            const updated=action.payload;
            if(!updated?.id||!updated?.username) return;
            state.reviews=state.reviews.map((r)=>
                r.userId===updated.id?{...r,username:updated.username}:r
            );
        });
    }
});

export default ReviewsSlice.reducer;

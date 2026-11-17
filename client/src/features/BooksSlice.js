import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API="http://localhost:3003";

export const fetchBooks=createAsyncThunk("books/fetchBooks",async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get(`${API}/books`);
        return response.data;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to load books");
    }
});

export const addBook=createAsyncThunk("books/addBook",async(payload,{rejectWithValue})=>{
    try{
        const response=await axios.post(`${API}/books`,payload);
        return response.data.book;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to add book");
    }
});

export const updateBook=createAsyncThunk("books/updateBook",async({id,...rest},{rejectWithValue})=>{
    try{
        const response=await axios.put(`${API}/books/${id}`,rest);
        return response.data.book;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to update book");
    }
});

export const deleteBook=createAsyncThunk("books/deleteBook",async(id,{rejectWithValue})=>{
    try{
        await axios.delete(`${API}/books/${id}`);
        return id;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to delete book");
    }
});

export const BooksSlice=createSlice({
    name:"books",
    initialState:{
        books:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchBooks.fulfilled,(state,action)=>{
            state.books=action.payload;
        })
        .addCase(addBook.fulfilled,(state,action)=>{
            state.books.unshift(action.payload);
        })
        .addCase(updateBook.fulfilled,(state,action)=>{
            state.books=state.books.map((b)=>b.id===action.payload.id?action.payload:b);
        })
        .addCase(deleteBook.fulfilled,(state,action)=>{
            state.books=state.books.filter((b)=>b.id!==action.payload);
        });
    }
});

export default BooksSlice.reducer;

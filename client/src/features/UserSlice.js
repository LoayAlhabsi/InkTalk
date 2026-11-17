import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API="http://localhost:3003";

export const fetchUsers=createAsyncThunk("user/fetchUsers",async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get(`${API}/users`);
        return response.data;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Failed to load users");
    }
});

export const login=createAsyncThunk("user/login",async(udata,{rejectWithValue})=>{
    try{
        const response=await axios.post(`${API}/login`,udata);
        if(response.data.user)
            return response.data;
        else
            return rejectWithValue(response?.data?.message||"Invalid Credentials");
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Invalid Credentials");
    }
});

export const register=createAsyncThunk("user/register",async(udata,{rejectWithValue})=>{
    try{
        const response=await axios.post(`${API}/register`,udata);
        if(response.data.message==="Registration successful")
            return response.data;
        else
            return rejectWithValue(response?.data?.message||"Error in Registration");
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Error in Registration");
    }
});

export const updateProfile=createAsyncThunk("user/updateProfile",async(payload,{getState,rejectWithValue})=>{
    try{
        const id=getState().user.user.id;
        if(!id) return rejectWithValue("Not logged in");
        const response=await axios.put(`${API}/users/${id}`,payload);
        return response.data.user;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Update failed");
    }
});

export const toggleSavedBook=createAsyncThunk("user/toggleSavedBook",async(bookId,{getState,rejectWithValue})=>{
    try{
        const id=getState().user.user.id;
        if(!id) return rejectWithValue("Not logged in");
        const response=await axios.put(`${API}/users/${id}/saved`,{bookId});
        return response.data.user;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Update failed");
    }
});

export const deleteUser=createAsyncThunk("user/deleteUser",async(id,{rejectWithValue})=>{
    try{
        await axios.delete(`${API}/users/${id}`);
        return id;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Delete failed");
    }
});

export const setUserRole=createAsyncThunk("user/setUserRole",async({id,role},{rejectWithValue})=>{
    try{
        const response=await axios.put(`${API}/users/${id}/role`,{role});
        return response.data.user;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Update failed");
    }
});

export const setUserStatus=createAsyncThunk("user/setUserStatus",async({id,status},{rejectWithValue})=>{
    try{
        const response=await axios.put(`${API}/users/${id}/status`,{status});
        return response.data.user;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Update failed");
    }
});

export const resetPassword=createAsyncThunk("user/resetPassword",async(udata,{rejectWithValue})=>{
    try{
        const response=await axios.post(`${API}/reset-password`,udata);
        return response.data.message;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message||"Reset failed");
    }
});

const initialState={
    user:{},
    users:[],
    isLoading:false,
    isSuccess:false,
    isError:false,
    message:""
};

export const UserSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        resetStatus:(state)=>{
            state.isLoading=false;
            state.isSuccess=false;
            state.isError=false;
            state.message="";
        },
        logout:(state)=>{
            state.user={};
            state.isLoading=false;
            state.isSuccess=false;
            state.isError=false;
            state.message="";
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUsers.fulfilled,(state,action)=>{
            state.users=action.payload;
        })
        .addCase(login.pending,(state)=>{
            state.isLoading=true;
            state.isError=false;
            state.isSuccess=false;
            state.message="";
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload.user;
            state.message=action.payload.message;
            state.isSuccess=true;
            state.isError=false;
        })
        .addCase(login.rejected,(state,action)=>{
            state.isLoading=false;
            state.user={};
            state.isError=true;
            state.isSuccess=false;
            state.message=action.payload;
        })
        .addCase(register.pending,(state)=>{
            state.isLoading=true;
            state.isError=false;
            state.isSuccess=false;
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.message=action.payload.message;
            state.isSuccess=true;
            state.isError=false;
            if(action.payload?.user){
                state.users.push(action.payload.user);
            }
        })
        .addCase(register.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.isSuccess=false;
            state.message=action.payload;
        })
        .addCase(updateProfile.fulfilled,(state,action)=>{
            state.user=action.payload;
            state.users=state.users.map((u)=>u.id===action.payload.id?action.payload:u);
            state.isSuccess=true;
            state.message="Profile updated";
        })
        .addCase(toggleSavedBook.fulfilled,(state,action)=>{
            state.user=action.payload;
            state.users=state.users.map((u)=>u.id===action.payload.id?action.payload:u);
        })
        .addCase(deleteUser.fulfilled,(state,action)=>{
            state.users=state.users.filter((u)=>u.id!==action.payload);
            if(state.user.id===action.payload) state.user={};
        })
        .addCase(setUserRole.fulfilled,(state,action)=>{
            state.users=state.users.map((u)=>u.id===action.payload.id?action.payload:u);
            if(state.user.id===action.payload.id){
                state.user=action.payload;
            }
        })
        .addCase(setUserStatus.fulfilled,(state,action)=>{
            if(!action.payload) return;
            state.users=state.users.map((u)=>u.id===action.payload.id?action.payload:u);
            if(state.user.id===action.payload.id&&action.payload.status==="suspended"){
                state.user={};
            }
        })
        .addCase(resetPassword.fulfilled,(state,action)=>{
            state.isSuccess=true;
            state.isError=false;
            state.message=action.payload||"Password updated";
        });
    }
});

export const {resetStatus,logout}=UserSlice.actions;
export default UserSlice.reducer;

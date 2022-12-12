import {createAsyncThunk} from '@reduxjs/toolkit';
import { LoginDto } from '@boilerplate/shared';
import { usersService } from '../data-services';

const loginUserAction = createAsyncThunk('user/login', async (body: LoginDto, { rejectWithValue }) => {
  try {
    const { data } = await usersService.login(body);
    console.log(data)

    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
})


export default loginUserAction;
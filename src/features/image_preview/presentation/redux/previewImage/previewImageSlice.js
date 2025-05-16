import { createSlice } from '@reduxjs/toolkit';
import PreviewImageStatus from './previewImageStatus';

const previewImageSlice = createSlice({
    name: 'previewImage',
    initialState: {
        status: PreviewImageStatus.INITIAL,
        coords: null,
        data: null,
        error: null,
    },
    reducers: {
        previewImageInitial: (state) => {
            state.status = null;
            state.coords = null;
            state.data = null;
            state.error = null;
        },
        previewImageLoading: (state) => {
            state.status = PreviewImageStatus.LOADING;
            state.coords = null;
            state.data = null;
            state.error = null;
        },
        previewImageCapturingMap: (state, action) => {
            state.status = PreviewImageStatus.CAPTURING_MAP;
            state.coords = action.payload.coords;
            state.data = null;
            state.error = null;
        },
        previewImageLoaded: (state, action) => {
            state.status = PreviewImageStatus.LOADED;
            state.coords = null;
            state.data = action.payload.uri;
            state.error = null;
        },
        previewImageError: (state, action) => {
            state.status = PreviewImageStatus.ERROR;
            state.coords = null;
            state.data = null;
            state.error = action.payload;
        },
    },
});

export const {
    previewImageInitial,
    previewImageLoading,
    previewImageCapturingMap,
    previewImageLoaded,
    previewImageError,
} = previewImageSlice.actions;

export default previewImageSlice.reducer;

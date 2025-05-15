import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import previewImageReducer from '../redux/previewImage/previewImageSlice';
import InnerImagePreviewScreen from '../components/InnerImagePreviewScreen';

const createPreviewStore = () =>
    configureStore({
        reducer: {
            previewImage: previewImageReducer,
        },
    });

const ImagePreviewScreen = (props) => {
    const store = createPreviewStore();
    return (
        <Provider store={store}>
            <InnerImagePreviewScreen {...props} />
        </Provider>
    );
};

export default ImagePreviewScreen;

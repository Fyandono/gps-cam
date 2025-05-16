import {
    previewImageInitial,
    previewImageLoading,
    previewImageLoaded,
    previewImageError,
    previewImageCapturingMap,
} from './previewImageSlice';

import { getCoordinates } from '../../../../../utils/location/LocationUtil';
import icon from '../../../../../../assets/icon_water_mark.png';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export const setInitialLoad = (imageUri, miniMapRef) => {
    return async (dispatch) => {
        try {
            dispatch(previewImageInitial());
            dispatch(previewImageLoading());

            // GET LOCATION
            const location = await getCoordinates();
            const coordData = {
                latitude: location.latitude,
                longitude: location.longitude,
            };

            dispatch(previewImageCapturingMap({ coords: coordData }));

            // GETTING MAPS RENDERED
            await new Promise(resolve => setTimeout(resolve, 3000));
            const getMapImageUri = async () => {
                try {
                    const mapImageUri = await captureRef(miniMapRef, {
                        format: 'png',
                        quality: 1,
                        result: 'tmpfile',
                    });
                    return mapImageUri;
                } catch (error) {
                    return null;
                }
            }
            let miniMapImageUri = await getMapImageUri();
            dispatch(previewImageLoading());

            // FORMATTING INFO
            let info = `Datetime: ${new Date().toUTCString()}
Latitude: ${coordData.latitude}
Longitude: ${coordData.longitude}
Altitude: ${location.altitude} meter
GPS Mocked: ${location.isMocked ? 'Yes' : 'No'}`;
            let data = {
                imageUri: imageUri,
                miniMapImageUri: miniMapImageUri,
                icon: icon,
                text: info
            }
            dispatch(previewImageLoaded({ uri: data }));
        } catch (err) {
            console.log(err);
            dispatch(previewImageError(err.message));
        }
    }
}

export const setOnSavePicture = (canvasRef, onSuccess, onError) => {
    return async (_) => {
        try {
            const image = canvasRef.current?.makeImageSnapshot();
            if (!image) throw new Error('Failed to create image snapshot');

            // Encode to Base64
            const base64 = image.encodeToBase64();
            const filename = `${FileSystem.documentDirectory}skia-image-${Date.now()}.png`;

            // Save Base64 string as PNG file
            await FileSystem.writeAsStringAsync(filename, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Request permission & save to media
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('No permission granted to save image.')
            }

            await MediaLibrary.saveToLibraryAsync(filename);
            onSuccess();
        } catch (err) {
            onError(err);
        }
    };
};
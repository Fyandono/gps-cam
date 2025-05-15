import {
    previewImageInitial,
    previewImageLoading,
    previewImageLoaded,
    previewImageError,
    previewImageCapturingMap,
} from './previewImageSlice';

import LocationUtil from '../../../../../utils/location/LocationUtil';
import Marker, { ImageFormat, Position } from 'react-native-image-marker';
import icon from '../../../../../../assets/icon_water_mark.png';

export const setInitialLoad = (imageUri, onSaveMiniMap) => {
    return async (dispatch) => {
        dispatch(previewImageInitial())
        dispatch(previewImageLoading())

        // GET LOCATION
        const location = await LocationUtil.getCoordinates();
        const coordData = {
            latitude: location.latitude,
            longitude: location.longitude,
        };
        dispatch(previewImageCapturingMap({ coords: coordData }));

        // TIMEOUT FOR GETTING MAPS RENDERED
        await new Promise(resolve => setTimeout(resolve, 1000))
        let miniMapImage = await onSaveMiniMap();
        dispatch(previewImageLoading());

        // RENDER MARKER
        try {
            const watermarkImages = [];
            if (miniMapImage) {
                watermarkImages.push({
                    src: miniMapImage,
                    position: {
                        position: Position.bottomRight
                    },
                });
            }

            watermarkImages.push({
                src: icon,
                position: {
                    position: Position.topRight
                },
                scale: 0.4,
                alpha: 0.8,
            });

            // IMAGE MARKER OPTIONS
            let optionsMaps = {
                backgroundImage: {
                    src: imageUri,
                    scale: 1,
                },
                watermarkImages: watermarkImages,
                scale: 1,
                quality: 100,
                filename: 'preview_marked_image',
                saveFormat: ImageFormat.png,
            };
            let markedWithMaps = await Marker.markImage(optionsMaps);

            // TEXT MARKER OPTIONS
            let optionsText = {
                backgroundImage: {
                    src: markedWithMaps,
                    scale: 1,
                },
                watermarkTexts: [{
                    text:
                        ` Datetime: ${new Date().toUTCString()}
 Latitude: ${location.latitude}
 Longitude: ${location.longitude}
 Altitude: ${location.altitude.toFixed()} meter
 GPS Mocked: ${location.isMocked ? 'Yes' : 'No'}`,
                    position: {
                        position: Position.bottomLeft,
                    },
                    style: {
                        color: '#FFF',
                        fontSize: 72,
                        fontName: 'Arial',
                        shadowStyle: {
                            dx: 1,
                            dy: 1,
                            radius: 10,
                            color: '#000',
                        },
                    },

                }],
                scale: 1,
                quality: 100,
                filename: 'preview_marked_image',
                saveFormat: ImageFormat.png,
            };
            let markedWithText = await Marker.markText(optionsText);

            dispatch(previewImageLoaded({ uri: markedWithText }));
        } catch (err) {
            console.log(err);
            dispatch(previewImageError(err.message));
        }
    }
}
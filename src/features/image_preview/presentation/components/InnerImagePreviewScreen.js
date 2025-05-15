import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Platform, PixelRatio } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialLoad } from '../redux/previewImage/previewImageActions';
import PreviewImageStatus from '../redux/previewImage/previewImageStatus';
import imagePreviewStyles from '../styles/styles';
import { captureRef } from 'react-native-view-shot';
import MapView, { Marker } from 'react-native-maps';

const InnerImagePreviewScreen = ({ route }) => {
    const { uri } = route.params;
    const { status, image, coords, error } = useSelector(state => state.previewImage);
    const dispatch = useDispatch();
    const miniMapRef = useRef();

    const onSaveMiniMap = async () => {
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
    };

    useEffect(() => {
        if (status === PreviewImageStatus.INITIAL) {
            dispatch(setInitialLoad(uri, onSaveMiniMap));
        }
    }, [status]);

    if (status === PreviewImageStatus.INITIAL || status === PreviewImageStatus.LOADING) {
        return (
            <View style={imagePreviewStyles.container}>
                <ActivityIndicator size="large" color="gray" />
                <Text style={imagePreviewStyles.info}>Loading location…</Text>
            </View>
        );
    }

    else if (status === PreviewImageStatus.CAPTURING_MAP) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="gray" />
                <Text>Capturing map preview…</Text>

                {/* Invisible map rendering for snapshot */}
                <View style={imagePreviewStyles.hiddenMapContainer} ref={miniMapRef} collapsable={false}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker coordinate={coords} />
                    </MapView>
                </View>
            </View>
        );
    }

    else if (status === PreviewImageStatus.LOADED) {
        return (
            <View >
                <View style={imagePreviewStyles.container}>
                    <Image src={image} style={imagePreviewStyles.image} />
                </View>
                <Button style={imagePreviewStyles.container} />
            </View >
        );
    }

    else if (status === PreviewImageStatus.ERROR) {
        return (
            <View style={imagePreviewStyles.container}>
                <Text style={imagePreviewStyles.error}>Error: {error}</Text>
            </View>
        );
    }

    else {
        return (
            <View style={imagePreviewStyles.container}>
                <Text style={imagePreviewStyles.info}>Unknown State</Text>
            </View>
        );
    }
};

export default InnerImagePreviewScreen;

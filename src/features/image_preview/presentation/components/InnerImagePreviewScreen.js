import { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Dimensions, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialLoad, setOnSavePicture as setOnSavePicture } from '../redux/previewImage/previewImageActions';
import PreviewImageStatus from '../redux/previewImage/previewImageStatus';
import imagePreviewStyles from '../styles/styles';
import MapView, { Marker } from 'react-native-maps';
import { Canvas, Image as ImageSkia, useImage, Text as ImageText, useFont, useCanvasRef } from '@shopify/react-native-skia';
const InnerImagePreviewScreen = ({ route }) => {
    const { uri } = route.params;
    const { status, data, coords, error } = useSelector(state => state.previewImage);
    const dispatch = useDispatch();
    const miniMapRef = useRef();
    const canvasRef = useCanvasRef();
    const screen = Dimensions.get('window');

    const onSavePicture = async () => {
        const onSuccess = () => {
            Alert.alert('Success Saving Image');
        }

        const onError = (error) => {
            Alert.alert('Error Saving Image', error);
        }

        dispatch(setOnSavePicture(canvasRef, onSuccess, onError))
    };

    useEffect(() => {
        if (status === PreviewImageStatus.INITIAL) {
            dispatch(setInitialLoad(uri, miniMapRef));
        }
    }, [status]);

    // Load Skia images only when data is available
    const baseImage = useImage(data?.imageUri);
    const mapImage = useImage(data?.miniMapImageUri);
    const icon = useImage(data?.icon);

    // Font settings
    const fontSize = 12;
    const font = useFont(require("../styles/arial.ttf"), fontSize);

    if (status === PreviewImageStatus.INITIAL || status === PreviewImageStatus.LOADING) {
        return (
            <View style={imagePreviewStyles.container}>
                <ActivityIndicator size="large" color="gray" />
                <Text style={imagePreviewStyles.info}>Loading location…</Text>
            </View>
        );
    }

    if (status === PreviewImageStatus.CAPTURING_MAP) {
        return (
            <View style={imagePreviewStyles.capturingMap}>
                <ActivityIndicator size="large" color="gray" />
                <Text>Capturing map preview…</Text>
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

    if (status === PreviewImageStatus.LOADED) {
        if (!baseImage || !mapImage || !font || !data) {
            return (
                <View style={imagePreviewStyles.container}>
                    <ActivityIndicator size="large" color="gray" />
                    <Text>Rendering preview…</Text>
                </View>
            );
        }

        let lines = data.text.split('\n');

        const scale = Math.min(
            screen.width / baseImage.width(),
            screen.height * 0.8 / baseImage.height(),
            1
        );
        const imgWidth = baseImage.width() * scale;
        const imgHeight = baseImage.height() * scale;

        const mapSize = 80;
        const mapMargin = 20;

        const mapX = mapMargin;
        const mapY = imgHeight - mapSize - mapMargin;

        const lineHeight = fontSize + 4; // Adjust spacing between lines
        const textX = mapX + mapSize + 10;
        const textStartY = mapY + lineHeight; // start a little below the map Y

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Canvas ref={canvasRef} style={{ width: imgWidth, height: imgHeight }}>
                    {/* Base Image */}
                    <ImageSkia
                        image={baseImage}
                        x={0}
                        y={0}
                        width={imgWidth}
                        height={imgHeight}
                        fit="cover"
                    />

                    {/* Logo Watermark */}
                    <ImageSkia
                        image={icon}
                        x={20}
                        y={20}
                        width={40}
                        height={40}
                        fit="cover"
                    />

                    {/* Mini Map Overlay */}
                    <ImageSkia
                        image={mapImage}
                        x={mapX}
                        y={mapY}
                        width={mapSize}
                        height={mapSize}
                        fit="contain"
                    />

                    {/* Text to the right of mini map */}
                    {lines.map((line, index) => (
                        <ImageText
                            key={index}
                            text={line}
                            x={textX}
                            y={textStartY + index * lineHeight}
                            font={font}
                            color="white"
                        />
                    ))}
                </Canvas>
                <View style={imagePreviewStyles.button}>
                    <Button title={'Save Picture'} onPress={onSavePicture} />
                </View>
            </View>
        );
    }

    if (status === PreviewImageStatus.ERROR) {
        return (
            <View style={imagePreviewStyles.container}>
                <Text style={imagePreviewStyles.error}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={imagePreviewStyles.container}>
            <Text style={imagePreviewStyles.info}>Unknown State</Text>
        </View>
    );
};

export default InnerImagePreviewScreen;

import { StyleSheet } from "react-native";

const imagePreviewStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        height: 480,
        width: '100%',
        resizeMode: 'contain',
    },
    error: {
        color: 'red',
        fontSize: 16,
        margin: 16,
    },
    hiddenMapContainer: {
        left: 1000,
        width: 160,
        height: 160,
    },
    capturingMap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        margin: 16,
    },
});

export default imagePreviewStyles;
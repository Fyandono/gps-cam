import { launchCameraAsync, PermissionStatus, requestCameraPermissionsAsync } from 'expo-image-picker';
import { Alert } from 'react-native';

class ImagePickerUtil {

    static async verifyPermissions() {
        const cameraPermissionResponse = await requestCameraPermissionsAsync();

        if (cameraPermissionResponse.status !== PermissionStatus.GRANTED) {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant camera permissions to use this app.'
            );
            return false;
        }

        return true;
    }

    static async takePicture(setPickedImage) {
        const hasPermission = await ImagePickerUtil.verifyPermissions();
        if (!hasPermission) {
            throw new Error('Camera permission not granted');
        }

        const image = await launchCameraAsync({
            allowsMultipleSelection: false,
            aspect: [16, 9],
            quality: 0.5,
        });


        if (!image.canceled) {
            setPickedImage(image.assets[0]);
        }
    }
}

export default ImagePickerUtil;

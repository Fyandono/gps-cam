import {
    getCurrentPositionAsync,
    requestForegroundPermissionsAsync,
    LocationAccuracy,
    PermissionStatus,
} from 'expo-location';

import { Alert, Platform } from 'react-native';

class LocationUtil {
    static async verifyPermissions() {
        const { status } = await requestForegroundPermissionsAsync();

        if (status !== PermissionStatus.GRANTED) {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant location permissions to use this app.'
            );
            return false;
        }

        return true;
    }

    static async getCoordinates() {
        const hasPermission = await LocationUtil.verifyPermissions();
        if (!hasPermission) {
            throw new Error('Location permission not granted');
        }

        const isAndroid = Platform.OS === 'android';

        const location = await getCurrentPositionAsync({
            accuracy: isAndroid ? LocationAccuracy.Low : LocationAccuracy.Lowest,
        });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            heading: location.coords.heading,
            isMocked: location.mocked ?? false,
        };
    }
}

export default LocationUtil;
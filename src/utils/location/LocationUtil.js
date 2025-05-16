// import {
//     getCurrentPositionAsync,
//     requestForegroundPermissionsAsync,
//     LocationAccuracy,
//     PermissionStatus,
//     useForegroundPermissions,
// } from 'expo-location';

// import { Alert, Platform } from 'react-native';

// class LocationUtil {

//     static async verifyPermissions() {
//         const { status } = await requestForegroundPermissionsAsync();

//         if (status !== PermissionStatus.GRANTED) {
//             Alert.alert(
//                 'Insufficient Permissions!',
//                 'You need to grant location permissions to use this app.'
//             );
//             return false;
//         }

//         return true;
//     }

//     static async getCoordinates() {
//         const hasPermission = await LocationUtil.verifyPermissions();
//         if (!hasPermission) {
//             throw new Error('Location permission not granted');
//         }

//         const isAndroid = Platform.OS === 'android';

//         const location = await getCurrentPositionAsync({
//             accuracy: isAndroid ? LocationAccuracy.Low : LocationAccuracy.Lowest,
//         });

//         return {
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             altitude: location.coords.altitude,
//             heading: location.coords.heading,
//             isMocked: location.mocked ?? false,
//         };
//     }
// }

// export default LocationUtil;

import {
    getCurrentPositionAsync,
    requestForegroundPermissionsAsync,
    PermissionStatus,
} from 'expo-location';
import { Alert } from 'react-native';

export async function verifyLocationPermissions() {
    const { status } = await requestForegroundPermissionsAsync();

    if (status === PermissionStatus.DENIED) {
        Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature.'
        );
        return false;
    }

    return status === PermissionStatus.GRANTED;
}

export async function getCoordinates() {
    const hasPermission = await verifyLocationPermissions();
    if (!hasPermission) {
        throw new Error('Location permission not granted');
    }

    const location = await getCurrentPositionAsync({ timeInterval: 1000 });

    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        isMocked: location.mocked ?? false,
    };
}
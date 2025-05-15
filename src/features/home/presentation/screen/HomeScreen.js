import { View, Text, Button, Alert } from 'react-native';
import ImagePickerUtil from '../../../../utils/image/ImageUtil';
import homeStyles from '../styles/styles';

function HomeScreen({ navigation }) {
    async function onTakePictures() {
        try {
            await ImagePickerUtil.takePicture(setPickedImage);

            function setPickedImage(image) {
                if (image) {
                    navigation.navigate('Image Preview', { uri: image.uri });
                } else {
                    Alert.alert('No image selected or capture cancelled.');
                }
            }
        } catch (error) {
            Alert.alert('Failed to take picture', error.message);
        }
    }

    return (
        <View style={homeStyles.container}>
            <Text style={homeStyles.titleText}>Welcome to GPS CAM</Text>
            <Button title="Take a Picture" onPress={onTakePictures} />
        </View>
    );
}

export default HomeScreen;
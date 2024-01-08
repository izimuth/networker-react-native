import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, PhotoFile, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

interface Props
{
	onDismiss(photo?: PhotoFile): void;
}

export default function AvatarPhotoBooth({ onDismiss }: Props)
{
	const camera = useRef<Camera>(null);
	const device = useCameraDevice('front');
	const insets = useSafeAreaInsets();
	const { hasPermission, requestPermission } = useCameraPermission();
	const cameraAvailable = device != null && hasPermission;

	const confirmPhoto = async () => {
		const photo = await camera.current?.takePhoto();

		if (photo)
			onDismiss(photo);
		else
			onDismiss();
	}

	return (
		<View style={[StyleSheet.absoluteFill, { backgroundColor: '#202020' }]}>
			{cameraAvailable && (
				<>
					<Camera
						ref={camera}
						photo={true}
						style={styles.cameraView}
						device={device}
						isActive={true}
					/>

					<View style={[styles.interface, { paddingBottom: insets.bottom + 20 }]}>
						<Button mode="contained" icon="camera-plus" onPress={() => confirmPhoto()}>Use Photo</Button>
						<Button mode="text" icon="close" onPress={() => onDismiss()}>Cancel</Button>
					</View>
				</>
			)}

			{!hasPermission && (
				<View style={styles.pending}>
					<Text>Permission to use your camera is required</Text>
					<Button onPress={() => requestPermission()}>Grant Permission</Button>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
	},

	cameraView: {
		flex: 1,
	},

	interface: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		bottom: 0,
		flexDirection: 'row',
		gap: 20,
		left: 0,
		justifyContent: 'center',
		paddingTop: 20,
		position: 'absolute',
		right: 0,
	},

	pending: {
		alignItems: 'center',
		backgroundColor: '#404040',
		flex: 1,
		justifyContent: 'center',
	},
})
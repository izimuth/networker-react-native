import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";

import { RootStackParams } from "../navProps";
import { profileUrl } from '../../secrets.json';

export default function ScannerScreen({ navigation }: NativeStackScreenProps<RootStackParams, 'Scanner'>)
{
	const camera = useRef<Camera>(null);
	const device = useCameraDevice('back');
	const { hasPermission, requestPermission } = useCameraPermission();
	const cameraAvailable = device != null && hasPermission;

	const scanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: (function() {
			let codeFound = false;

			return (codes) => {
				if (codeFound)
					return;

				const prefix = `${profileUrl}/`;
				const offset = prefix.length;

				// check each code to see if it matches the expected URL
				for(const code of codes) 
				{
					if (code.value?.startsWith(prefix))
					{
						const profileCode = code.value.slice(offset);
						codeFound = true;
						navigation.replace('Profile', { id: profileCode });
						return;
					}
				}
			}
		})()
	});

	return (
		<View style={[styles.main, { backgroundColor: '#202020' }]}>
			{cameraAvailable && (
				<>
					<Camera
						ref={camera}						
						codeScanner={scanner}
						style={styles.cameraView}
						device={device}
						isActive={true}
					/>

					{/* <View style={[styles.interface, { paddingBottom: insets.bottom + 20 }]}>
						<Button mode="contained" icon="camera-plus" onPress={() => {}}>Use Photo</Button>
						<Button mode="text" icon="close" onPress={() => {}}>Cancel</Button>
					</View> */}
				</>
			)}

			{!hasPermission && (
				<View style={styles.pending}>
					<Text>Permission to use your camera is required</Text>
					<Button onPress={() => requestPermission()}>Grant Permission</Button>
				</View>
			)}
		</View>	);
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
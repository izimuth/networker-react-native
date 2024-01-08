import { useState } from "react";
import { ActionSheetIOS, Alert, StyleSheet, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Portal } from "react-native-paper";
import { PhotoFile } from "react-native-vision-camera";
import { Asset, launchImageLibrary } from "react-native-image-picker";

import { bucketUrl } from '../../secrets.json';
import { Backend, useBackend } from "../../backend";
import { useProfile } from "./profileStore";
import { confirmAlert } from "../../utils";
import AvatarPhotoBooth from "./AvatarPhotoBooth";

const AVATAR_SIZE = 120;

async function uploadAvatarFromAsset(backend: Backend, file: Asset)
{
	// add to form data
	const formData = new FormData();
	formData.append('photo', {
		uri: file.uri,
		type: file.type,
		name: file.fileName
	});

	// upload
	await backend.request('POST', '/profile/photo', {
		headers: {
			'content-type': 'multipart/form-data'
		},
		body: formData,
	});
}

async function uploadAvatarFromCamera(backend: Backend, photo: PhotoFile)
{
	// add to form data
	const formData = new FormData();
	formData.append('photo', {
		uri: `file://${photo.path}`,
		type: 'image/jpeg',
		name: 'camera.jpg',
	});

	// upload
	await backend.request('POST', '/profile/photo', {
		headers: {
			'content-type': 'multipart/form-data'
		},
		body: formData,
	});
}


export default function ProfileAvatar()
{	
	const backend = useBackend();
	const profile = useProfile();
	const user = useProfile(state => state.user);
	const [loading, setLoading] = useState(false)

	const avatarText = !loading && user?.display_name.slice(0, 2).toUpperCase();
	const [photoBoothActive, setPhotoBoothActive] = useState(false);

	// remove the user's avatar
	const onDeleteAvatar = async () => {
		try
		{
			if (!await confirmAlert('Are you sure you want to delete your avatar?'))
				return;

			setLoading(true);

			await backend.request('DELETE', '/profile/photo');
			await profile.refresh();
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Failed to delete avatar');
		}
		finally
		{
			setLoading(false);
		}
	};

	const onSelectImage = async () => {
		try
		{
			const result = await launchImageLibrary({ mediaType: 'photo' });

			if (result?.assets && result.assets.length > 0)
			{
				setLoading(true);
				await uploadAvatarFromAsset(backend, result.assets[0]);
				await profile.refresh();
			}
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Failed to delete avatar');
		}
		finally
		{
			setLoading(false);
		}
	}

	const onPhoto = async (photo?: PhotoFile) => {
		setPhotoBoothActive(false);

		if (!photo)
			return;

		try
		{
			setLoading(true);
			await uploadAvatarFromCamera(backend, photo);
			await profile.refresh();
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Failed to delete avatar');
		}
		finally
		{
			setLoading(false);
		}
	}

	// called when the user clicks the edit button
	const onChangePress = () => {
		ActionSheetIOS.showActionSheetWithOptions({
			options: ['Select Image', 'Use Camera', 'Remove Avatar', 'Cancel'],
			destructiveButtonIndex: 2,
			cancelButtonIndex: 3,
		}, index => {
			switch(index) {
				// select image from device
				case 0:
					onSelectImage();
					break;
				// use camera
				case 1: 
					setPhotoBoothActive(true);
					break;
				// delete profile avatar
				case 2:
					onDeleteAvatar();
					break;
			}
		});
	}

	return (
		<View style={styles.avatar}>
			{!loading ? (
				user?.avatar_file ? (
					<Avatar.Image
						source={{ uri: `${bucketUrl}/${user?.avatar_file}` }}
						size={AVATAR_SIZE}
					/>
				) : (
					<Avatar.Text 
						label={avatarText || ''}
						size={AVATAR_SIZE}
					/>
				)
			) : (
				<ActivityIndicator
					animating={true}
					size={AVATAR_SIZE}
				/>
			)}

			{profile.isSelf() && (
				<Button mode="outlined" disabled={loading} icon="pencil" onPress={onChangePress}>Change Avatar</Button>
			)}

			{profile.isSelf() && photoBoothActive && (
				<Portal>
					<AvatarPhotoBooth 
						onDismiss={photo => onPhoto(photo)} 
					/>
				</Portal>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	avatar: {
		alignItems: 'center',
		gap: 12,
		marginBottom: 20,
		marginTop: 20,
		position: 'relative',
	},
});
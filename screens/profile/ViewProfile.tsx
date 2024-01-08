
import Ionicon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect } from 'react';
import { ActionSheetIOS, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper';

import NameField from './NameField';
import ProfileFields from './ProfileFields';
import ToggleProfileVisibility from './ToggleProfileVisibility';
import ProfileQRCode from './ProfileQRCode';
import ProfileAvatar from './ProfileAvatar';
import ToggleFollowing from './ToggleFollowing';
import { RootStackParams } from '../navProps';
import { useProfile } from './profileStore';
import { Pressable } from 'react-native';
import { getShareableUrl } from '../../models/User';
import { useFocusEffect } from '@react-navigation/native';
import { useAppState } from '../../store';

export type ViewProfileProps = NativeStackScreenProps<RootStackParams, 'Profile', 'self'>;

export default function ViewProfile({ navigation, route }: ViewProfileProps)
{
	const id = route.params.id;
	const profile = useProfile();
	const currentUser = useAppState(state => state.currentUser);
	const isSelf = id == 'self';

	const refreshProfile = async () => {
		profile.loadProfile(id);
	}

	// display iphoneOS share sheet
	const shareProfile = () => {
		ActionSheetIOS.showShareActionSheetWithOptions({
			url: getShareableUrl(profile.user!),
		}, () => {}, () => {});
	}

	useEffect(() => {
		// add share button to right header action
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<Pressable onPress={shareProfile}>
					<Ionicon 
						color={tintColor}
						size={24}
						name="share-outline"
					/>
				</Pressable>
			)
		});
	}, [navigation]);

	useFocusEffect(useCallback(() => {
		refreshProfile();
	}, []));

	return (
		<ScrollView 
			style={styles.scrollView}
			refreshControl={
				<RefreshControl 
					refreshing={profile.loading}
					onRefresh={() => refreshProfile()}
				/>
			}>

			<View style={styles.container}>
				{!profile.loading && !profile.error && (
					<>
						<View style={{ alignItems: 'center' }}>
							<ProfileAvatar />
							<NameField />
						</View>

						{isSelf && <ToggleProfileVisibility />}
						{!isSelf && currentUser && <ToggleFollowing/>}

						<ProfileFields />
						{profile.user && <ProfileQRCode user={profile.user} />}
					</>
				)}

				{!profile.loading && profile.error && (
					<Text>{profile.error}</Text>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	
	container: {
		//alignItems: 'center',
		display: 'flex',
		flex: 1,
		padding: 16,
	},
})
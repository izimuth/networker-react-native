import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ScrollView, RefreshControl, Alert, SafeAreaView } from "react-native";
import { Appbar, Avatar, Button, Card, IconButton, List, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Link, useFocusEffect } from "@react-navigation/native";
import Ionicon from 'react-native-vector-icons/Ionicons';

import { useAppState } from "../../store";
import { RootStackParams } from "../navProps";
import { bucketUrl } from '../../secrets.json';
import { useHome } from "./homeStore";
import FollowerList from "./FollowerList";
import ProfileAvatar from "../../components/ProfileAvatar";
import ProfileQRCode from "../profile/ProfileQRCode";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParams, 'Home'>;

export default function HomeScreen({ navigation, route }: Props)
{
	const currentUser = useAppState(state => state.currentUser);
	const appState = useAppState();
	const home = useHome();
	const [loading, setLoading] = useState(false);

	const reload = async () => {
		setLoading(true);

		try
		{
			await appState.refreshUserInfo();
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'An error occurred while loading data');
		}
		finally
		{
			setLoading(false);
		}
	}

	// add settings link to top left
	useEffect(() => {
		navigation.setOptions({
			headerLeft: ({ tintColor }) => (
				<Link to={{ screen: 'Settings' }}>
					<Ionicon name="menu-outline" color={tintColor} size={24} />
				</Link>
			)
		});
	}, [navigation]);

	// load data on navigation
	useFocusEffect(useCallback(() => {
		reload();
	}, []));

	return (
		<ScrollView 
			style={styles.container}
			refreshControl={
				<RefreshControl
					refreshing={loading}
					onRefresh={() => reload()}
				/>
			}>
			{currentUser ? (
				<View style={styles.home}>
					<View style={styles.avatarRow}>
						<ProfileAvatar
							user={currentUser}
							size={90}
							onPress={() => navigation.push('Profile', { id: 'self' })}
						/>

						<Text variant="displaySmall" style={{ fontWeight: '200' }}>{currentUser.display_name}</Text>
					</View>

					<View style={styles.followingTitle}>
						<Text variant="titleLarge" style={{ fontWeight: '200' }}>Connections</Text>
						<Button mode="contained-tonal" icon="qrcode-scan" onPress={() => navigation.push('Scanner')}>Scan</Button>
					</View>

					<Card>
						<Link to={{ screen: 'UserList', params: { source: 'following' } }}>
							<List.Item
								title={`Following (${currentUser.num_following ?? 0})`}
								right={props => <List.Icon {...props} icon="chevron-right" />}
							/>
						</Link>

						<Link to={{ screen: 'UserList', params: { source: 'followers' } }}>
							<List.Item
								title={`Followers (${currentUser.num_followers ?? 0})`}
								right={props => <List.Icon {...props} icon="chevron-right" />}
							/>
						</Link>
					</Card>

					{/* <FollowerList 
						onProfileTap={user => navigation.push('Profile', { id: user.shareable_code })}
					/> */}

					<View style={{ alignItems: 'center' }}>
						<ProfileQRCode 
							user={currentUser}
							title="Share Your Profile"
						/>
					</View>
				</View>
			) : (
				<View style={styles.home}>
					<Text>You are not signed in</Text>
					<Button mode="contained-tonal" onPress={() => navigation.push('Login')}>Login</Button>
					<Button mode="outlined" icon="qrcode" onPress={() => navigation.push('Scanner')}>Scan QR Code</Button>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	home: {
		alignItems: 'stretch',
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		gap: 16,
		padding: 16,
	},

	avatarRow: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		gap: 16,
	},

	followingTitle: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	}
})
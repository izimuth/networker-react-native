
import { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RefreshControl, Alert, FlatList, StyleSheet, View } from "react-native";
import { Card, Divider, Text, TouchableRipple } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { RootStackParams } from "../navProps";
import { useBackend } from "../../backend";
import { User } from "../../models/User";
import ProfileAvatar from "../../components/ProfileAvatar";

type Props = NativeStackScreenProps<RootStackParams, 'UserList'>;

export default function UserListScreen({ navigation, route }: Props)
{
	const backend = useBackend();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);

	const refreshList = async () => {
		setLoading(true);

		try
		{
			const result = await backend.request<{ users: User[] }>('GET', `/connections/${route.params.source}`);
			setUsers(result?.users ?? []);
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Failed to load user list');
		}
		finally
		{
			setLoading(false);
		}
	}

	useEffect(() => {
		if (route.params.source == 'followers')
			navigation.setOptions({ title: 'Followers' });
		else if (route.params.source == 'following')
			navigation.setOptions({ title: 'Following' });
	}, [route.params.source])

	useFocusEffect(useCallback(() => {
		refreshList();
	}, []));

	return (
		<View style={styles.main}>
			{users.length > 0 && (
				<FlatList
					data={users}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={refreshList}
						/>
					}
					renderItem={({ item: user }) => (
						<TouchableRipple key={user.id} style={{ marginBottom: 8 }} onPress={() => navigation.push('Profile', { id: user.shareable_code })}>
							<Card>
								<Card.Content style={styles.profileContent}>
									<ProfileAvatar
										user={user}
										size={36}
									/>
									<Text variant="titleMedium">{user.display_name}</Text>
								</Card.Content>
							</Card>
						</TouchableRipple>
					)}
				/>
			)}

			{users.length == 0 && !loading && (
				<Text variant="titleLarge" style={{ textAlign: 'center', fontWeight: '300' }}>No users found</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		alignItems: 'stretch',
		gap: 8,
		padding: 16,
	},

	profileContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
	},


})
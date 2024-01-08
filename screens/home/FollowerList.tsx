import { useState } from "react";
import { useAppState } from "../../store";
import { User } from "../../models/User";
import { useHome } from "./homeStore";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, Text, TouchableRipple } from "react-native-paper";
import ProfileAvatar from "../../components/ProfileAvatar";

interface Props
{
	onProfileTap: (user: User) => void;
}

export default function FollowerList({ onProfileTap }: Props)
{
	const home = useHome();

	return (
		<View style={styles.main}>
			{!home.loading && home.following.length == 0 && (
				<Card>
					<Card.Content>
						<Text variant="titleMedium" style={{ fontWeight: '200', textAlign: 'center' }}>Not following anybody</Text>
					</Card.Content>
				</Card>
			)}

			{!home.loading && home.following.length > 0 && home.following.map(user => (
				<TouchableRipple key={user.id} onPress={() => onProfileTap(user)}>
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
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		alignItems: 'stretch',
		gap: 8,
	},

	profileContent: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
	},


})
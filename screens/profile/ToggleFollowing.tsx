import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useBackend } from "../../backend";
import { useProfile } from "./profileStore";

export default function ToggleFollowing()
{
	const user = useProfile(state => state.user!);
	const isFollowing = useProfile(state => state.isFollowing);
	const backend = useBackend();
	const [toggled, setToggled] = useState(isFollowing);

	const toggle = async (value: boolean) => {
		const org = toggled;

		console.log(value);

		try
		{
			setToggled(value);

			// add to following list
			if (value)
			{
				await backend.request('POST', '/profile/followers', {
					json: { id: user.id }
				});
			}
			// removing
			else
			{
				await backend.request('DELETE', `/profile/followers/${user.id}`);
			}
		}
		catch(err)
		{
			setToggled(org);
			console.log(err);
			Alert.alert('Error', 'An error occurred');
		}
	};

	return (
		<View style={styles.main}>
			<Switch
				value={toggled}
				onValueChange={value => toggle(value)}
			/>
			<Text>{toggled ? 'Following this user' : 'Not following this user'}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		alignItems: 'center',
		backgroundColor: '#202020',
		borderRadius: 10,
		display: 'flex',
		flexDirection: 'row',
		gap: 16,
		//justifyContent: 'space-between',
		marginTop: 16,
		padding: 16,
	}
});
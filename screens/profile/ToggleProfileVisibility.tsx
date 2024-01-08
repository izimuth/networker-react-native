import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useBackend } from "../../backend";
import { useProfile } from "./profileStore";

export default function ToggleProfileVisibility()
{
	const user = useProfile(state => state.user);
	const backend = useBackend();
	const [visible, setVisible] = useState<boolean>(user?.is_visible ?? false);

	const updateVisibility = async (value: boolean) => {
		const org = visible;

		try
		{
			setVisible(value);

			await backend.request('POST', '/profile', {
				json: { is_visible: value }
			});
		}
		catch(err)
		{
			setVisible(org);
			console.log(err);
			Alert.alert('Error', 'An error occurred');
		}
	};

	return (
		<View style={styles.main}>
			<Switch
				value={visible}
				onValueChange={value => updateVisibility(value)}
			/>
			<Text>Make profile visible to others</Text>
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
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { User } from "../../models/User";
import { useAppState } from "../../store";
import { apiUrl } from '../../secrets.json';
import { useBackend } from "../../backend";
import { useProfile } from "./profileStore";

interface NameFieldProps 
{
	user: User;
}

export default function NameField()
{
	const theme = useTheme();
	const backend = useBackend();
	const appState = useAppState();
	const currentUser = useAppState(state => state.currentUser);
	const user = useProfile(state => state.user);
	const isSelf = useProfile(state => state.isSelf());
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [name, setName] = useState('');

	// enable editing of display name
	const editName = useCallback(() => {
		setEditing(true);
		setName(user!.display_name);
	}, []);

	// update display name on backend
	const saveName = useCallback(async (name: string) => {
		setSaving(true);

		try
		{
			await backend.request('POST', '/profile', { 
				json: { display_name: name }
			});

			appState.updateUserInfo({ display_name: name });

			setEditing(false);
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Failed to save name');
		}
		finally
		{
			setSaving(false);
		}
	}, [name]);

	return (
		<View style={styles.wrapper}>
			{!editing && <Text style={styles.displayName}>{isSelf ? currentUser?.display_name : user?.display_name}</Text>}

			{isSelf && !editing && (
				<IconButton
					mode="contained"
					containerColor={theme.colors.primaryContainer}
					icon="pencil"
					onPress={() => editName()}
				/>
			)}

			{isSelf && editing && (
				<View style={styles.nameField}>
					<TextInput
						value={name}
						onChangeText={value => setName(value)}
						right={
							<TextInput.Icon 
								icon="close-circle" 
								disabled={saving} 
								onPress={() => setEditing(false)} 
							/>
						}
					/>

					<Button mode="contained-tonal" disabled={saving} onPress={() => saveName(name)}>Update Name</Button>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		gap: 12,
	},

	nameField: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		gap: 8,
	},

	displayName: {
		fontSize: 24,
		fontWeight: '200',
	}
});
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useBackend } from "../../backend";
import { confirmAlert } from "../../utils";
import { useAppState } from "../../store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../navProps";

type Props = NativeStackScreenProps<RootStackParams, 'DeleteAccount'>;

export default function DeleteAccountScreen({ navigation }: Props)
{
	const backend = useBackend();
	const appState = useAppState();

	const confirmDelete = async () => {
		if (!await confirmAlert('Are you sure you want to proceed?', 'Point Of No Return'))
			return;

		try
		{
			// submit deletion
			await backend.request('GET', '/delete/account');

			// clear session
			appState.clearCurrentUser();
			
			// return to home screen
			navigation.popToTop();
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'An error occurred');
		}
	}

	return (
		<View style={styles.main}>
			<Text style={styles.title}>Account Deletion</Text>
			<Text style={styles.info}>
				You are about to delete your account. This is not reversible. Are you sure you want to continue?
			</Text>

			<Button mode="contained" buttonColor="#660000" textColor="white" onPress={() => confirmDelete()}>Delete My Account</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		alignItems: 'stretch',
		flex: 1,
		gap: 16,
		justifyContent: 'center',
		padding: 16,
	},

	title: {
		fontWeight: '600',
		fontSize: 32,
	},

	info: {
		fontSize: 18,
	}
});

import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { apiUrl } from '../../secrets.json';
import { useAppState } from '../../store';
import { RootStackParams } from '../navProps';
import { useBackend } from '../../backend';

type Props = NativeStackScreenProps<RootStackParams, 'Login'>;

export default function LoginScreen({ navigation }: Props)
{
	const appState = useAppState();
	const backend = useBackend();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		setLoading(true);

		try
		{
			const result: any = await backend.request('POST', '/auth/login', {
				json: { email, password }
			});

			if (result.success)
			{
				appState.setCurrentUser(result.user, result.token);
				navigation.pop();
			}
			else
			{
				Alert.alert('Login Failed', 'Invalid email address or password');
			}
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Login failed');
		}
		finally
		{
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				disabled={loading}
				label="Email Address"
				keyboardType="email-address"
				autoCapitalize="none"
				autoComplete="email"
				value={email}
				onChangeText={value => setEmail(value)}
			/>

			<TextInput
				disabled={loading}
				secureTextEntry
				label="Password"
				autoCapitalize="none"
				onChangeText={value => setPassword(value)}
			/>

			<Button mode="contained-tonal" onPress={() => onSubmit()}>Login</Button>
			<Button mode="text" onPress={() => navigation.push('Registration')}>Create Account</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignContent: 'stretch',
		display: 'flex',
		flex: 1,
		justifyContent: 'center',
		gap: 12,
		padding: 12,		
	}
});
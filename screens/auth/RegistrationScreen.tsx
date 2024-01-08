
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { InferType, object, ref, string } from "yup";
import { useBackend } from "../../backend";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../navProps";

const regSchema = object({
	displayName: string().required('Display name is required'),
	
	email: string()
		.required('Email address is required')
		.email('Invalid email address'),
	
	password: string()
		.required('Password is required')
		.min(6, 'Passwords must be at least six characters long'),

	passwordConf: string()
		.required('Please re-enter your password')
		.oneOf([ref('password'), ''], 'Passwords must match')
});

type Props = NativeStackScreenProps<RootStackParams, 'Registration'>;

export default function RegistrationScreen({ navigation }: Props)
{
	const backend = useBackend();

	const [fields, setFields] = useState<InferType<typeof regSchema>>({
		displayName: '',
		email: '',
		password: '',
		passwordConf: '',
	});

	const [loading, setLoading] = useState(false);
	const [isValid, setValid] = useState(false);
	const [validationResult, setValidationResult] = useState<InferType<typeof regSchema>>();

	const updateField = (field: string, value: string) => {
		setFields({ ...fields, [field]: value });
	};

	const onSubmit = async () => {
		setLoading(true);

		try
		{
			const body = {
				display_name: fields.displayName,
				email: fields.email,
				password: fields.password,
			};

			await regSchema.validate(fields);
			await backend.request('POST', '/auth/create', {
				json: body,
			});

			Alert.alert('Success', 'Registration successful. You may now login.');

			navigation.pop();
		}
		catch(err)
		{
			console.log(err);

			if (err instanceof Error)
				Alert.alert('Error', err.message);
			else
				Alert.alert('Error', 'An error occurred');
		}
		finally
		{
			setLoading(false);
		}
	}

	useEffect(() => {
		regSchema.isValid(fields).then(valid => setValid(valid));
	}, [fields]);

	return (
		<ScrollView contentContainerStyle={styles.main}>
			<TextInput
				label="Display Name"
				value={fields.displayName}
				onChangeText={value => updateField('displayName', value)}
			/>
			<TextInput
				label="Email Address"
				keyboardType="email-address"
				autoCapitalize="none"
				value={fields.email}
				onChangeText={value => updateField('email', value)}
			/>
			<TextInput
				secureTextEntry
				label="Password"
				value={fields.password}
				onChangeText={value => updateField('password', value)}
			/>
			<TextInput
				secureTextEntry
				label="Confirm Password"
				value={fields.passwordConf}
				onChangeText={value => updateField('passwordConf', value)}
			/>
			<Button mode="contained-tonal" disabled={loading} onPress={() => onSubmit()}>Submit</Button>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	main: {
		alignItems: 'stretch',
		display: 'flex',
		flex: 1,
		//justifyContent: 'center',
		gap: 12,
		padding: 12,		
	}
});
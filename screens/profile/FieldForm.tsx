import { Alert, StyleSheet, View } from "react-native";
import { Button, Modal, Text, TextInput } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { UserField } from "../../models/User";
import { useFieldState } from "./fieldStore";
import { RootStackParams } from "../navProps";
import { useEffect, useState } from "react";
import { useBackend } from "../../backend";
import { useAppState } from "../../store";
import { iconTypes } from "./ProfileFields";
import FieldIconSelector from "./FieldIconSelector";

type Props = NativeStackScreenProps<RootStackParams, 'FieldForm'>;

const defaultField: UserField = {
	id: 0,
	user_id: 0,
	field_content: '',
	field_icon_type: '',
	field_name: '',
};


export default function FieldForm({ route, navigation }: Props)
{
	const [loading, setLoading] = useState(false);
	const [field, setField] = useState<UserField>({ ...defaultField });
	const [canSubmit, setCanSubmit] = useState(false);

	const currentUser = useAppState(state => state.currentUser);
	const fieldState = useFieldState();
	const backend = useBackend();

	if (!currentUser)
	{
		return (
			<View>
				<Text>No user logged in</Text>
			</View>
		);
	}

	// utility to update field data
	const updateField = (data: Partial<UserField>) => {
		setField({ ...field, ...data });
	};

	// save field
	const saveField = async () => {
		setLoading(true);

		try
		{
			const method = field.id == 0 ? 'POST' : 'PUT';
			const path = field.id == 0 ? `/profile/fields` : `/profile/fields/${field.id}`;

			await backend.request(method, path, {
				json: { ...field }
			});

			await fieldState.loadFields();

			navigation.goBack();
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Unable to save field, please try again');
		}
		finally
		{
			setLoading(false);
		}
	}

	// initialize field data on navigation
	useEffect(() => {
		// initialize new field if id is 0
		if (route.params.id == 0)
		{
			setField({ 
				...defaultField,
			});
		}
		// otherwise load field from backend
		else
		{
			setLoading(true);

			// request from backend api
			backend.request<any>('GET', `/profile/fields/${route.params.id}`)
				.then((resp) => {
					if (resp.field)
						setField({ ...resp.field });
				})
				.catch(err => {
					console.log(err);
					Alert.alert('Error', 'failed to load field');
					navigation.goBack();
				})
				.finally(() => setLoading(false));
		}
	}, [route, navigation]);

	// update field name
	useEffect(() => {
		const name = field.field_name?.trim() ?? '';
		const type = iconTypes[field.field_icon_type];

		if (type)
			updateField({ field_name: type.name });

	}, [field.field_icon_type])

	// toggle flag if form can be submitted
	useEffect(() => {
		const fields = [field.field_content, field.field_name, field.field_icon_type];

		for(const value of fields)
		{
			if (!value || value.trim() == '')
			{
				setCanSubmit(false);
				return;
			}
		}

		setCanSubmit(true);
	}, [field.field_name, field.field_content, field.field_icon_type]);

	return (
		<View style={styles.main}>
			<FieldIconSelector
				disabled={loading}
				value={field.field_icon_type}
				onChange={value => updateField({ field_icon_type: value })}
			/>

			<TextInput 
				disabled={loading}
				label="Field Name"
				value={field.field_name}
				onChangeText={value => updateField({ field_name: value })}
			/>

			<TextInput 
				disabled={loading}
				label="Field Content"
				value={field.field_content}
				onChangeText={value => updateField({ field_content: value })}
			/>

			<Button mode="contained-tonal" disabled={loading || !canSubmit} onPress={() => saveField()}>Save Field</Button>
			<Button mode="text" disabled={loading} onPress={() => navigation.goBack()}>Back</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		gap: 12,
		padding: 20,
	}
});
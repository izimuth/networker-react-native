import { useEffect } from "react";
import { View, FlatList, StyleSheet, Alert, RefreshControl } from "react-native";
import { Appbar, Button, FAB, Icon, IconButton, List, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackParams } from "../navProps";
import { useBackend } from "../../backend";
import { useFieldState } from "./fieldStore";
import { iconTypes } from "./ProfileFields";
import { UserField } from "../../models/User";

type Props = NativeStackScreenProps<RootStackParams, 'EditFields'>;

export default function EditFieldsScreen({ route, navigation }: Props)
{
	const backend = useBackend();
	const fieldState = useFieldState();
	const insets = useSafeAreaInsets();
	const fabStyle = StyleSheet.compose(styles.fab, {
		bottom: insets.bottom
	});

	const deleteField = async (field: UserField) => {
		fieldState.setLoading(true);

		try
		{
			await backend.request('DELETE', `/profile/fields/${field.id}`);
			await fieldState.loadFields();
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'Failed to delete field');
		}
		finally
		{
			fieldState.setLoading(false);
		}
	};

	const confirmDelete = (field: UserField) => {
		Alert.alert('Delete Field', 'Are you sure you want to delete this field?', [
			{
				text: 'No',
				isPreferred: true,
			},
			{
				text: 'Yes',
				style: 'destructive',
				onPress() {
					deleteField(field);
				}
			}
		])
	}

	useEffect(() => {
		fieldState.loadFields();
	}, [navigation]);

	return (
		<View style={styles.main}>
			{fieldState.fields.length > 0 && (
				<>
					<FlatList
						data={fieldState.fields}
						refreshControl={
							<RefreshControl 
								refreshing={fieldState.loading}
								onRefresh={() => fieldState.loadFields()}
							/>
						}
						renderItem={({ item }) => (
							<List.Item
								style={{ paddingRight: 16 }}
								key={item.id}
								title={item.field_name}
								description={item.field_content}
								onPress={() => navigation.push('FieldForm', { id: item.id })}
								left={props => <List.Icon {...props} icon={iconTypes[item.field_icon_type]?.icon} />}
								right={props => (
									<IconButton 
										icon="delete" 
										iconColor="#ff5050"
										onPress={() => confirmDelete(item)} 
									/>
								)}
							/>
						)}
					/>

					<FAB
						style={fabStyle}
						icon="plus"
						onPress={() => navigation.push('FieldForm', { id: 0 })}
					/>
				</>
			)}

			{fieldState.fields.length == 0 && (
				<View style={styles.noFields}>
					<Text variant="titleMedium">You have no fields yet!</Text>
					<Button mode="contained-tonal" onPress={() => navigation.push('FieldForm', { id: 0 })}>Add Field</Button>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
	},

	fields: {
		flex: 1,
	},
	
	noFields: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		gap: 12,
		padding: 20,
	},

	fab: {
		bottom: 16,
		position: 'absolute',
		right: 16,
	},

	fieldItem: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		gap: 20,
		paddingVertical: 20,
		paddingHorizontal: 20,
	},

	fieldItemText: {
		flex: 1,
	}
});
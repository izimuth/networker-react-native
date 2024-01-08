import { StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Divider, List } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAppState } from "../../store";
import { RootStackParams } from "../navProps";

interface SettingsMenuItem
{
	title: string;
	icon: string;
	isDestructive?: boolean;
	onPress(): void;
}

type Props = NativeStackScreenProps<RootStackParams, 'Settings'>;

export default function SettingsScreen({ navigation }: Props)
{
	const appState = useAppState();
	const menu: Array<Array<SettingsMenuItem>> = [
		[
			{
				title: 'Terms & Conditions',
				icon: 'chevron-right',
				onPress() { },
			},
			{
				title: 'Privacy Policy',
				icon: 'chevron-right',
				onPress() { },
			},
			{
				title: 'Support',
				icon: 'chevron-right',
				onPress() {},
			}
		],
		[
			{
				title: 'Delete My Account',
				icon: 'chevron-right',
				isDestructive: true,
				onPress: () => navigation.push('DeleteAccount'),
			},
		],
		[
			{
				title: 'Sign Out',
				icon: 'logout',
				onPress() { 
					Alert.alert('Sign Out', 'Sign out from all devices as well?', [
						{
							text: 'Cancel',
							style: 'cancel',
						},
						{
							text: 'No',
							isPreferred: true,
							onPress: () => logOut(false),
						},
						{
							text: 'Yes',
							onPress: () => logOut(true),
						}
					])
				},
			},	
		]
	];

	const logOut = async (fromAll: boolean) => {
		try
		{
			// delete auth token from device 
			await appState.signOut(fromAll);

			navigation.pop();
		}
		catch(err)
		{
			console.log(err);
			Alert.alert('Error', 'An error occurred');
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.main}>
			{menu.map((items, blockIndex) => (
				<Card key={blockIndex}>
					{items.map((item, index) => (
						<List.Item
							key={item.title}
							title={item.title}
							titleStyle={item.isDestructive ? { color: 'red' } : undefined}
							right={props => <List.Icon {...props} icon={item.icon} />}
							onPress={() => item.onPress()}
						/>
					))}
				</Card>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	main: {
		alignItems: 'stretch',
		flex: 1,
		gap: 16,
		padding: 16,
	},
})
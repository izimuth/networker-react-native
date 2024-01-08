import { Linking, StyleSheet, View } from "react-native";
import { Button, Card, List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { User, UserField } from "../../models/User";
import { useAppState } from "../../store";
import type { ViewProfileProps } from "./ViewProfile";
import { useProfile } from "./profileStore";

export interface IconInfo
{
	name: string,
	icon: string;
	getLink(val: string): string;
}

export const iconTypes: Record<string, IconInfo> = {
	email: { 
		name: 'Email', 
		icon: 'email',
		getLink: (val: string) => `mailto:${val}`,
	},
	phone: { 
		name: 'Phone',
		icon: 'phone',
		getLink: (val: string) => `tel:${val.replace(/[^0-9]/g, '')}`,
	},
	website: { 
		name: 'Link',
		icon: 'link',
		getLink: (val: string) => val,
	},
	info: { 
		name: 'Info',
		icon: 'help',
		getLink: (val: string) => '',
	},
	facebook: { 
		name: 'Facebook',
		icon: 'facebook',
		getLink: (val: string) => `https://facebook.com/${val}`,

	},
	twitter: { 
		name: 'Twitter',
		icon: 'twitter',
		getLink: (val: string) => `https://x.com/${val}`,

	},
	linkedin: { 
		name: 'LinkedIn',
		icon: 'linkedin',
		getLink: (val: string) => `https://linkedin.com/${val}`,

	},
	instagram: { 
		name: 'Instagram',
		icon: 'instagram',
		getLink: (val: string) => `https://www.instagram.com/${val}`,
	},
}

export default function ProfileFields()
{
	const appState = useAppState();
	const isSelf = useProfile(state => state.isSelf());
	const user = useProfile(state => state.user);
	const fields = user?.fields ?? [];
	const nav = useNavigation<ViewProfileProps['navigation']>();

	const onFieldPress = async (field: UserField) => {
		const link = iconTypes[field.field_icon_type]?.getLink(field.field_content) ?? '';

		if (link.trim() != '' && await Linking.canOpenURL(link))
		{
			await Linking.openURL(link);
		}
	}

	return (
		<View style={styles.main}>
			{fields.length > 0 && (
				<Card style={styles.fieldList}>
					{fields.map(field => (
						<List.Item
							key={field.id}
							title={field.field_content}
							left={props => <List.Icon {...props } icon={iconTypes[field.field_icon_type].icon} />}
							onPress={() => onFieldPress(field)}
						/>
					))}

					{isSelf && (
						<Card.Actions>
							<Button mode="text" onPress={() => nav.push('EditFields')}>Edit My Fields</Button>
						</Card.Actions>
					)}
				</Card>
			)}

			{isSelf && fields.length == 0 && (
				<Button mode="contained-tonal" onPress={() => nav.push('EditFields')}>Edit My Fields</Button>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		marginTop: 20,
	},

	fieldList: {
	}
});
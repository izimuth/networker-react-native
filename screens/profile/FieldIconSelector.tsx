import { StyleSheet, View } from "react-native";
import { Card, Icon, List, Modal, Portal, Text, TextInput } from "react-native-paper";

import { iconTypes } from "./ProfileFields";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";

interface Props
{
	disabled?: boolean;
	value: string;
	onChange(type: string): void;
}

export default function FieldIconSelector({ disabled, value, onChange }: Props)
{
	const [showOptions, showOptionsModal] = useState(false);

	const selectType = (type: string) => {
		onChange(type);
		showOptionsModal(false);
	}

	return (
		<View>
			<TextInput
				disabled={disabled}
				mode="outlined"
				editable={false}
				value={iconTypes[value]?.name ?? '(Select Type)'}
				right={<TextInput.Icon icon={iconTypes[value]?.icon ?? 'help'} onPress={() => showOptionsModal(true)} />}
				onPressOut={() => !disabled && showOptionsModal(true)}
			/>

			<Portal>
				<Modal visible={showOptions} onDismiss={() => showOptionsModal(false)} contentContainerStyle={styles.selector}>
					<Card>
						{Object.keys(iconTypes).map(type => (
							<List.Item
								style={{ paddingHorizontal: 16 }}
								key={type}
								title={iconTypes[type].name}
								left={props => <List.Icon icon={iconTypes[type].icon}/>}
								onPress={() => selectType(type)}
							/>
						))}
					</Card>
				</Modal>
			</Portal>
		</View>
	);
}

const styles = StyleSheet.create({
	selector: {
		padding: 20,
	}
});
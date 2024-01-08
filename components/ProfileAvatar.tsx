import { Pressable } from "react-native";
import { Avatar } from "react-native-paper";

import { User } from "../models/User";
import { bucketUrl } from '../secrets.json';

interface Props
{
	user: User;
	size: number;
	onPress?: () => void;
}

export default function ProfileAvatar({ user, size, onPress }: Props)
{
	const avatar = user.avatar_file ? (
		<Avatar.Image
			source={{ uri: `${bucketUrl}/${user.avatar_file}` }}
			size={size}
		/>
	) : (
		<Avatar.Text
			label={user.display_name.toUpperCase().slice(0, 2)}
			size={size}
		/>
	);

	return onPress != undefined ? (
		<Pressable onPress={onPress}>{avatar}</Pressable>
	) : (
		avatar
	);
}
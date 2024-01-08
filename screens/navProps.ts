
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParams = {
	Home: undefined,
	Settings: undefined,
	Login: undefined,
	Scanner: undefined,
	Registration: undefined,
	DeleteAccount: undefined,
	EditFields: undefined,
	Profile: { id: string },
	FieldForm: { id: number },
	UserList: {
		source: 'following' | 'followers'
	}
}
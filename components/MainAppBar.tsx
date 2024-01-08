import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";

export default function MainAppBar({ back, options, navigation, route }: NativeStackHeaderProps)
{
	const headerProps = {
		canGoBack: navigation.canGoBack(),

	}

	return (
		<Appbar.Header>
			{navigation.canGoBack() && <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} />}
			<Appbar.Content mode="small" title={options.title ?? route.name} />
			{options.headerRight?.({ canGoBack: navigation.canGoBack() })}
		</Appbar.Header>
	);
}
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function clamp(val: number, min: number, max: number)
{
	if (val < min)
		return min;
	else if (val > max)
		return max;
	else
		return val;
}

interface ConfirmAlertOptions
{
	acceptText?: string;
	acceptStyle?: 'default' | 'destructive' | 'cancel';
	cancelText?: string;
	cancelStyle?: 'default' | 'destructive' | 'cancel';
}

export function confirmAlert(message: string, title?: string, options?: ConfirmAlertOptions): Promise<boolean>
{
	return new Promise((resolve, reject) => {
		console.log('wat');
		Alert.alert(title ?? 'Confirm', message, [
			{
				text: options?.cancelText ?? 'No',
				style: options?.cancelStyle ?? 'default',
				isPreferred: true,
				onPress: () => resolve(false),
			},
			{
				text: options?.acceptText ?? 'Yes',
				style: options?.acceptStyle ?? 'destructive',
				onPress: () => resolve(true),
			}
		])	
	});
}

/**
 * Returns style props that can be passed to a scroll views content container to respect the safe area
 */
export function useSafeAreaStyle()
{
	const insets = useSafeAreaInsets();

	return {
		paddingLeft: insets.left,
		paddingRight: insets.right,
		paddingTop: insets.top,
		paddingBottom: insets.bottom
	}
}
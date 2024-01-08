
import QRCode from 'qrcode';
import { SvgXml } from 'react-native-svg';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { User, getShareableUrl } from "../../models/User";
import { useProfile } from './profileStore';

interface Props
{
	user: User;
	title?: string;
	width?: number;
	height?: number;
}

export default function ProfileQRCode({ user, title, width, height }: Props)
{
	//const user = useProfile(state => state.user);
	const [status, setStatus] = useState('Loading');
	const [svg, setSvg] = useState('');

	if (!width)
		width = 160;

	if (!height)
		height = 160;

	useEffect(() => {
		if (user)
		{
			const url = getShareableUrl(user);
			QRCode.toString(url, { type: 'svg', margin: 1 }, (err, svgText) => {
				if (err)
				{
					setStatus('QR Code Error');
				}
				else
				{
					setStatus('');
					setSvg(svgText);
				}
			});
		}
	}, [user])

	return (
		<View style={styles.wrapper}>
			{status && (
				<View style={[ { width, height }, styles.status]}>
					<Text style={{ color: '#efefef' }}>{status}</Text>
				</View>
			)}

			{!status && svg && (
				<>
					<Text variant="bodyLarge">{title ?? 'Share Profile'}</Text>
					<SvgXml 
						xml={svg}
						width={width}
						height={height}
					/>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper:
	{
		alignItems: 'center',
		display: 'flex',
		//flexDirection: 'row',
		padding: 24,
		justifyContent: 'center',
	},

	main: {
		height: 160,
		width: 160,
	},

	status: {
		alignItems: 'center',
		backgroundColor: '#404040',
		flex: 1,
		justifyContent: 'center',
	}
});
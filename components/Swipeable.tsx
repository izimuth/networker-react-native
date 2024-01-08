import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import Animated, { clamp, runOnJS, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

interface Props 
{
	leftBgColor?: string;
	rightBgColor?: string;
	children: any;
	leftContent?: React.ReactNode;
	rightContent?: React.ReactNode;
	onLeftAction?: () => void;
	onRightAction?: () => void;
}

export default function Swipeable(props: Props)
{
	const min = props.rightContent ? -100 : 0;
	const max = props.leftContent ? 100 : 0;
	const leftBg = props.leftBgColor ?? '#f2873f'
	const rightBg = props.rightBgColor ?? '#f23f3f';
	const theme = useTheme();
	const offset = useSharedValue(0);
	const showContent = useSharedValue('');
	const animStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: offset.value }]
	}));

	const onFinished = (value: number) => {
		if (value <= min)
			props.onRightAction?.();
		else if (value >= max)
			props.onLeftAction?.();
	}

	const swipeLeft = Gesture
		.Pan()
		.onUpdate(e => {
			// match position of child element with horizontal swipe position
			offset.value = clamp(e.translationX, min, max);
		})
		.onEnd(() => {
			// animate child back to original position
			offset.value = withTiming(0);

			// trigger callbacks
			runOnJS(onFinished)(offset.value);
		})
	
	return (
		<GestureHandlerRootView>
			<View style={styles.bgWrapper}>
				{props.leftContent && <Animated.View style={[{ backgroundColor: leftBg }, styles.bgItem]}>{props.leftContent}</Animated.View>}
				{props.rightContent && <Animated.View style={[{ backgroundColor: rightBg }, styles.bgItem, styles.bgItemRight]}>{props.rightContent}</Animated.View>}
			</View>

			<GestureDetector gesture={swipeLeft}>
				<Animated.View style={[styles.wrapper, animStyle]}>
					{props.children}
				</Animated.View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	bgWrapper: {
		alignContent: 'stretch',
		display: 'flex',
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	},

	bgItem: {
		alignItems: 'center',
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
	},

	bgItemRight: {
		justifyContent: 'flex-end',
	},

	wrapper: {
		backgroundColor: 'black',
		position: 'relative',
		zIndex: 3,
	}
})
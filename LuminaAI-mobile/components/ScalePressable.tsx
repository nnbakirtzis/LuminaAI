import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle, View } from 'react-native';

interface ScalePressableProps extends PressableProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    scaleTo?: number;
    containerStyle?: StyleProp<ViewStyle>;
}

export default function ScalePressable({
    children,
    style,
    scaleTo = 0.97,
    containerStyle,
    ...props
}: ScalePressableProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: scaleTo,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    return (
        <View style={containerStyle}>
            <Pressable
                {...props}
                onPressIn={(e) => {
                    onPressIn();
                    props.onPressIn?.(e);
                }}
                onPressOut={(e) => {
                    onPressOut();
                    props.onPressOut?.(e);
                }}
            >
                <Animated.View style={[{ transform: [{ scale }] }, style]}>
                    {children}
                </Animated.View>
            </Pressable>
        </View>
    );
}

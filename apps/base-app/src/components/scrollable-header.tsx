// https://github.com/PedroBern/react-native-collapsible-tab-view/issues/449#issuecomment-3685402512

import type { ReactNode } from 'react';
import {
  type StyleProp,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import {
  useScroller,
  useTabsContext,
} from 'react-native-collapsible-tab-view/src/hooks';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import { useAppColors } from '@/theme/use-app-colors';

import type { IconSymbolName } from './ui';
import { IconSymbol, Image } from './ui';

export interface ScrollableHeaderProps {
  /**
   * Header content
   */
  children: ReactNode;
  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * NativeWind class names for the container
   */
  className?: string;
  /**
   * Minimum sliding distance, default is 5
   */
  minDistance?: number;
  /**
   * Minimum velocity to trigger inertial scrolling, default is 50
   */
  minVelocity?: number;
  /**
   * Damping coefficient for inertial scrolling, default is 0.998 (the larger the value, the stronger the inertia, range: 0.95-0.999)
   */
  deceleration?: number;
  /**
   * Optional background image URI
   */
  backgroundImageUri?: string;
  /**
   * Height of the header when background image is provided, default is 300
   */
  height?: number;
  /**
   * Left button configuration
   */
  left?: {
    disabled?: boolean;
    icon: {
      color?: string;
      name: IconSymbolName;
      type?: 'community' | 'material';
    };
    onPress: () => void;
  };
  /**
   * Right buttons configuration
   */
  right?: {
    disabled?: boolean;
    icon: {
      backgroundColor?: string;
      color?: string;
      name: IconSymbolName;
      type?: 'community' | 'material';
    };
    onPress: () => void;
  }[];
  /**
   * Optional back button callback (for backwards compatibility)
   */
  onBackPress?: () => void;
  /**
   * Parallax factor for background image (0-1), default is 0.4
   * Higher values create stronger parallax effect
   */
  parallaxFactor?: number;
  /**
   * Enable background image parallax, default is true
   */
  parallaxEnabled?: boolean;
}

/**
 * Scrollable Header component
 * Allows users to control the scrolling of FlatList in Tabs.Container through gestures
 *
 * @example
 * ```tsx
 * <Tabs.Container
 *   renderHeader={() => (
 *     <ScrollableHeader>
 *       <View>
 *         <Text>Header Content</Text>
 *       </View>
 *     </ScrollableHeader>
 *   )}
 * >
 *   <Tabs.Tab name="Tab1">
 *     <Tabs.FlatList data={data} renderItem={renderItem} />
 *   </Tabs.Tab>
 * </Tabs.Container>
 * ```
 */
export const ScrollableHeader = ({
  children,
  style,
  className,
  minDistance = 5,
  minVelocity = 50,
  deceleration = 0.998,
  backgroundImageUri,
  height = 300,
  left,
  right,
  onBackPress,
  parallaxFactor = 0.4,
  parallaxEnabled = true,
}: ScrollableHeaderProps) => {
  const { refMap, focusedTab } = useTabsContext();
  const colors = useAppColors();
  const scrollTo = useScroller();
  const scrollY = useCurrentTabScrollY();
  const initialScrollY = useSharedValue(0);
  const isGestureActive = useSharedValue(false);
  const targetScrollY = useSharedValue(0); // Target position for inertial scrolling

  // Listen for changes in targetScrollY and execute scroll animation
  useAnimatedReaction(
    () => targetScrollY.value,
    (targetY) => {
      'worklet';
      if (!isGestureActive.value) {
        const currentTab = focusedTab.value;
        const ref = refMap[currentTab];
        if (ref) {
          scrollTo(ref, 0, Math.max(0, targetY), false, 'momentumScroll');
        }
      }
    },
    [refMap, focusedTab, scrollTo]
  );

  // Create gesture handler to allow the entire header to control list scrolling
  const headerPanGesture = Gesture.Pan()
    .minDistance(minDistance)
    .onStart(() => {
      'worklet';
      // Cancel the previous inertial scroll animation
      cancelAnimation(targetScrollY);
      // Record the scroll position when the gesture starts
      const currentScrollY =
        typeof scrollY?.value === 'number' ? scrollY.value : 0;
      initialScrollY.value = currentScrollY;
      targetScrollY.value = currentScrollY;
      isGestureActive.value = true;
    })
    .onUpdate((e) => {
      'worklet';
      // Prioritize handling vertical sliding
      if (
        Math.abs(e.translationY) > Math.abs(e.translationX) ||
        Math.abs(e.translationY) > 10
      ) {
        // Get the ref of the current tab
        const currentTab = focusedTab.value;
        const ref = refMap[currentTab];

        if (ref) {
          // Calculate the target scroll position
          // Sliding down (translationY > 0) should increase scrollY (content scrolls down)
          // Sliding up (translationY < 0) should decrease scrollY (content scrolls up)
          const delta = -e.translationY; // Reverse the direction because sliding down should scroll the content down
          const newTargetScrollY = Math.max(0, initialScrollY.value + delta);
          targetScrollY.value = newTargetScrollY;

          // Synchronously scroll the FlatList
          scrollTo(ref, 0, newTargetScrollY, false, 'headerGesture');
        }
      }
    })
    .onEnd((e) => {
      'worklet';
      isGestureActive.value = false;

      // Add inertial scrolling if the velocity is high enough
      if (Math.abs(e.velocityY) > minVelocity) {
        // Negative velocityY means sliding up (content scrolls up), positive value means sliding down (content scrolls down)
        // We need to reverse the direction because the direction of velocityY is opposite to that of scrollY
        const velocity = -e.velocityY; // Reverse the velocity direction

        // Use withDecay to implement inertial scrolling
        targetScrollY.value = withDecay(
          {
            velocity: velocity,
            deceleration: deceleration,
            clamp: [0, Infinity], // Limit minimum value, no limit on maximum value (determined by content)
          },
          (finished) => {
            'worklet';
            // Callback after animation completion
            if (finished) {
              // Ensure the final position is correct
              const finalY = Math.max(0, targetScrollY.value);
              targetScrollY.value = finalY;
            }
          }
        );
      } else {
        // Velocity is not high enough, stop directly
        const currentScrollY =
          typeof scrollY?.value === 'number'
            ? scrollY.value
            : targetScrollY.value;
        targetScrollY.value = Math.max(0, currentScrollY);
      }
    })
    .onFinalize(() => {
      'worklet';
      isGestureActive.value = false;
    });

  // Parallax effect for background image
  const backgroundImageAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const currentScrollY =
      typeof scrollY?.value === 'number' ? scrollY.value : 0;
    const parallaxY = parallaxEnabled ? currentScrollY * parallaxFactor : 0;
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height,
      zIndex: 0,
      transform: [{ translateY: parallaxY }],
    };
  });

  const headerContent = (
    <GestureDetector gesture={headerPanGesture}>
      <View className={className} style={style}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Left button - only show if NO background image */}
          {!backgroundImageUri &&
            (left ? (
              <TouchableOpacity onPress={left.onPress} disabled={left.disabled}>
                <IconSymbol
                  size={32}
                  name={left.icon.name}
                  color={left.icon.color ?? colors.foreground}
                  type={left.icon.type}
                />
              </TouchableOpacity>
            ) : onBackPress ? (
              <TouchableOpacity onPress={onBackPress}>
                <IconSymbol
                  size={32}
                  name="arrow.backward"
                  color={colors.foreground}
                />
              </TouchableOpacity>
            ) : null)}

          {/* Main content */}
          <View style={{ flex: 1 }}>{children}</View>

          {/* Right buttons */}
          {!backgroundImageUri && (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {!!right?.length &&
                right.map((rt, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={rt.onPress}
                    disabled={rt.disabled}
                    style={
                      rt.icon.backgroundColor
                        ? {
                            alignItems: 'center',
                            backgroundColor: rt.icon.backgroundColor,
                            borderRadius: 999,
                            height: 36,
                            justifyContent: 'center',
                            width: 36,
                          }
                        : undefined
                    }
                  >
                    <IconSymbol
                      size={28}
                      name={rt.icon.name}
                      color={rt.icon.color ?? colors.foreground}
                      type={rt.icon.type}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </View>
    </GestureDetector>
  );

  if (!backgroundImageUri) {
    return headerContent;
  }

  return (
    <View style={{ height, position: 'relative', overflow: 'hidden' }}>
      <Animated.View style={backgroundImageAnimatedStyle}>
        <Image
          source={{ uri: backgroundImageUri }}
          contentFit="cover"
          style={{ height: '100%', width: '100%' }}
        />
      </Animated.View>
      {/* Back button at top */}
      {(left || onBackPress) && (
        <TouchableOpacity
          onPress={left ? left.onPress : onBackPress}
          disabled={left?.disabled}
          style={{
            position: 'absolute',
            top: 12,
            left: 16,
            zIndex: 11,
            padding: 4,
          }}
        >
          <IconSymbol
            size={32}
            name={left?.icon.name ?? 'arrow.backward'}
            color={left?.icon.color ?? 'white'}
            type={left?.icon.type}
          />
        </TouchableOpacity>
      )}
      {/* Right buttons at top */}
      {!!right?.length && (
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            zIndex: 11,
            flexDirection: 'row',
            gap: 12,
          }}
        >
          {right.map((rt, index) => (
            <TouchableOpacity
              key={index}
              onPress={rt.onPress}
              disabled={rt.disabled}
              style={
                rt.icon.backgroundColor
                  ? {
                      alignItems: 'center',
                      backgroundColor: rt.icon.backgroundColor,
                      borderRadius: 999,
                      height: 36,
                      justifyContent: 'center',
                      width: 36,
                    }
                  : undefined
              }
            >
              <IconSymbol
                size={28}
                name={rt.icon.name}
                color={rt.icon.color ?? 'white'}
                type={rt.icon.type}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Rounded card content at bottom */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        {headerContent}
      </View>
    </View>
  );
};

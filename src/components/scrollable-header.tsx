// https://github.com/PedroBern/react-native-collapsible-tab-view/issues/449#issuecomment-3685402512

import React, { type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import {
  useScroller,
  useTabsContext,
} from 'react-native-collapsible-tab-view/src/hooks';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  useAnimatedReaction,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

export interface ScrollableHeaderProps {
  /**
   * Header content
   */
  children: ReactNode;
  /**
   * Container style
   */
  style?: ViewStyle;
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
  minDistance = 5,
  minVelocity = 50,
  deceleration = 0.998,
}: ScrollableHeaderProps) => {
  const { refMap, focusedTab } = useTabsContext();
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
      initialScrollY.value = scrollY.value;
      targetScrollY.value = scrollY.value;
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
        targetScrollY.value = Math.max(0, scrollY.value);
      }
    })
    .onFinalize(() => {
      'worklet';
      isGestureActive.value = false;
    });

  return (
    <GestureDetector gesture={headerPanGesture}>
      <View style={style}>{children}</View>
    </GestureDetector>
  );
};

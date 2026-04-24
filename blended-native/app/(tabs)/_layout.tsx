import React, { useMemo } from 'react';
import { Tabs, useRouter } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getAppColors } from '../../lib/theme';

type TabIconName = React.ComponentProps<typeof Feather>['name'];

const LABEL_FONT_SIZE = 8.5;

const impactLight = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics нь зарим орчинд боломжгүй байж болно (web гэх мэт)
  }
};

const CustomTabBar: React.FC<BottomTabBarProps> = (props) => {
  const scheme = useColorScheme();
  const router = useRouter();
  const isDark = scheme === 'dark';
  const c = getAppColors(isDark ? 'dark' : 'light');

  const focusedRouteName =
    props.state.routes[props.state.index]?.name ?? 'index';

  const showBookingCta = focusedRouteName !== 'booking';

  const colors = useMemo(
    () => ({
      bg: c.bg,
      border: c.divider,
      active: c.fg,
      inactive: c.muted2,
    }),
    [c]
  );

  const onPressBooking = async () => {
    await impactLight();
    router.push('/(tabs)/booking');
  };

  return (
    <View style={[styles.tabBarWrap]}>
      {showBookingCta ? (
        <View style={styles.bookingCtaWrap} pointerEvents="box-none">
          <Pressable
            onPress={onPressBooking}
            style={({ pressed }) => [
              styles.bookingCta,
              {
                backgroundColor: c.primaryBg,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.bookingCtaText,
                { color: c.primaryFg },
              ]}
            >
              Цаг авах
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.bg,
            borderTopColor: colors.border,
          },
        ]}
      >
        {props.state.routes.map((route, index) => {
          const isFocused = props.state.index === index;

          const onPress = async () => {
            const event = props.navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              await impactLight();
              props.navigation.navigate(route.name);
            } else if (isFocused) {
              await impactLight();
            }
          };

          const onLongPress = () => {
            props.navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const { label, icon } = getTabMeta(route.name as string);
          const tint = isFocused ? colors.active : colors.inactive;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={props.descriptors[route.key]?.options
                .tabBarAccessibilityLabel}
              testID={props.descriptors[route.key]?.options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tabItem,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name={icon} size={20} color={tint} />
              <Text style={[styles.tabLabel, { color: tint }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* iOS-ийн доод safe area зайг Tabs өөрөө тооцдог (insets) */}
    </View>
  );
};

const getTabMeta = (routeName: string): { label: string; icon: TabIconName } => {
  switch (routeName) {
    case 'index':
      return { label: 'Нүүр', icon: 'home' };
    case 'booking':
      return { label: 'Барбер', icon: 'calendar' };
    case 'shop':
      return { label: 'Бүтээгдэхүүн', icon: 'shopping-bag' };
    case 'profile':
      return { label: 'Профайл', icon: 'user' };
    default:
      return { label: routeName, icon: 'circle' };
  }
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="booking" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'relative',
  },
  bookingCtaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -20,
    alignItems: 'center',
    zIndex: 10,
  },
  bookingCta: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  bookingCtaText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tabBar: {
    height: 80,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: '600',
  },
});


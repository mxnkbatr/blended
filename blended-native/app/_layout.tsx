import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CartProvider } from '../providers/CartProvider';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider';
import { WishlistProvider } from '../providers/WishlistProvider';

function RootStack() {
  const { scheme } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <RootStack />
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


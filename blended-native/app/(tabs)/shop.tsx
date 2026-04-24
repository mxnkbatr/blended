import React, { useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  Animated,
  Easing,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { products, type Product } from '../../lib/data/products';
import { getAppColors } from '../../lib/theme';
import { HIT_SLOP_10 } from '../../lib/ui';
import { useCart } from '../../providers/CartProvider';
import { useWishlist } from '../../providers/WishlistProvider';

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = getAppColors(scheme);

  const [query, setQuery] = useState('');
  const { addItem, totalItems } = useCart();
  const wishlist = useWishlist();

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslate = useRef(new Animated.Value(8)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const hay = `${p.name} ${p.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const showToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    toastOpacity.stopAnimation();
    toastTranslate.stopAnimation();

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslate, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    toastTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslate, {
          toValue: 8,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1100);
  };

  const impactLight = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics нь зарим орчинд боломжгүй байж болно (web гэх мэт)
    }
  };

  const formatPrice = (priceMnt: number) => {
    return `${new Intl.NumberFormat('mn-MN').format(priceMnt)} ₮`;
  };

  const addToCart = async (p: Product) => {
    await impactLight();
    addItem({
      slug: p.slug,
      name: p.name,
      priceMnt: p.priceMnt,
      imageUrl: p.imageUrl,
      quantity: 1,
    });
    showToast();
  };

  const renderHeader = () => {
    return (
      <View style={[styles.header, { paddingTop: Math.max(16, insets.top + 8) }]}>
        <Text style={[styles.kicker, { color: c.muted2 }]}>SHOP</Text>
        <Text style={[styles.title, { fontFamily: 'Georgia', color: c.fg }]}>Дэлгүүр</Text>
        <Text style={[styles.subtitle, { color: c.muted }]}>
          Вакс болон үс арчилгааны сонголтууд.
        </Text>

        <View style={[styles.searchWrap, { backgroundColor: c.surface, borderColor: c.surfaceBorder }]}>
          <Feather name="search" size={18} color={c.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Хайх..."
            placeholderTextColor={c.muted2}
            style={[styles.searchInput, { color: c.fg }]}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={HIT_SLOP_10}
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Хайлт арилгах"
            >
              <Feather name="x" size={18} color={c.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Product }) => {
    const wished = wishlist.has(item.slug);
    return (
      <Pressable
        onPress={() => router.push(`/shop/${item.slug}`)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} дэлгэрэнгүй`}
        style={({ pressed }) => [
          styles.card,
          {
            opacity: pressed ? 0.92 : 1,
            borderColor: c.cardBorder,
            backgroundColor: c.card,
          },
        ]}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
        <Text style={[styles.name, { color: c.fg }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: c.muted }]}>{formatPrice(item.priceMnt)}</Text>

        <View style={styles.btnRow}>
          <Pressable
            onPress={() => wishlist.toggle(item.slug)}
            hitSlop={HIT_SLOP_10}
            accessibilityRole="button"
            accessibilityLabel={wished ? 'Хүслийн жагсаалтаас хасах' : 'Хүслийн жагсаалтад нэмэх'}
            style={({ pressed }) => [
              styles.heartBtn,
              { opacity: pressed ? 0.85 : 1, borderColor: c.cardBorder },
            ]}
          >
            <Feather name="heart" size={18} color={wished ? '#ef4444' : c.fg} />
          </Pressable>

          <Pressable
            onPress={() => addToCart(item)}
            accessibilityRole="button"
            accessibilityLabel="Сагсанд нэмэх"
            style={({ pressed }) => [
              styles.cartBtn,
              {
                opacity: pressed ? 0.85 : 1,
                backgroundColor: c.primaryBg,
              },
            ]}
          >
            <Feather name="shopping-bag" size={16} color={c.primaryFg} />
            <Text style={[styles.cartBtnText, { color: c.primaryFg }]}>Сагслах</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: c.bg }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.colWrap}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        style={[styles.list, { backgroundColor: c.bg }]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslate }],
            bottom: 90 + insets.bottom,
            backgroundColor: c.toastBg,
            borderColor: c.toastBorder,
          },
        ]}
      >
        <Text style={[styles.toastText, { color: c.fg }]}>Сагсанд нэмлээ</Text>
      </Animated.View>

      {/* cart state is intentionally local for v1 */}
      <Text style={{ height: 0, width: 0, opacity: 0 }}>{totalItems}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: {},
  listContent: { paddingBottom: 140 },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3.2,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0.9,
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
    lineHeight: 20,
  },
  searchWrap: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  colWrap: {
    gap: 12,
    paddingHorizontal: 16,
  },
  separator: { height: 12 },

  card: {
    flex: 1,
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  price: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heartBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    flex: 1,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cartBtnText: {
    fontSize: 11,
    fontWeight: '900',
  },

  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});


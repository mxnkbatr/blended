import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { getProductBySlug } from '../../lib/data/products';
import { getAppColors } from '../../lib/theme';
import { HIT_SLOP_10 } from '../../lib/ui';
import { useCart } from '../../providers/CartProvider';
import { useWishlist } from '../../providers/WishlistProvider';

const impactLight = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // web дээр дуугүй өнгөрнө
  }
};

export default function ShopDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = getAppColors(isDark ? 'dark' : 'light');
  const { addItem } = useCart();
  const wishlist = useWishlist();

  const product = useMemo(() => {
    if (!slug) return undefined;
    return getProductBySlug(String(slug));
  }, [slug]);

  const bg = c.bg;
  const fg = c.fg;
  const muted = c.muted2;
  const border = c.cardBorder;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Pressable
          onPress={async () => {
            await impactLight();
            router.back();
          }}
          hitSlop={HIT_SLOP_10}
          accessibilityRole="button"
          accessibilityLabel="Буцах"
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Feather name="chevron-left" size={20} color={fg} />
          <Text style={[styles.backText, { color: fg }]}>Буцах</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {product ? (
          <>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.heroImage}
              contentFit="cover"
            />
            <Text style={[styles.name, { color: fg }]}>{product.name}</Text>
            <Text style={[styles.price, { color: muted }]}>
              {new Intl.NumberFormat('mn-MN').format(product.priceMnt)} ₮
            </Text>
            <Text style={[styles.desc, { color: muted }]}>{product.description}</Text>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={async () => {
                  await impactLight();
                  wishlist.toggle(product.slug);
                }}
                hitSlop={HIT_SLOP_10}
                accessibilityRole="button"
                accessibilityLabel={
                  wishlist.has(product.slug) ? 'Хүслийн жагсаалтаас хасах' : 'Хүслийн жагсаалтад нэмэх'
                }
                style={({ pressed }) => [
                  styles.heartBtn,
                  { borderColor: border, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Feather
                  name="heart"
                  size={18}
                  color={wishlist.has(product.slug) ? '#ef4444' : fg}
                />
              </Pressable>

              <Pressable
                onPress={async () => {
                  await impactLight();
                  addItem({
                    slug: product.slug,
                    name: product.name,
                    priceMnt: product.priceMnt,
                    imageUrl: product.imageUrl,
                    quantity: 1,
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel="Сагсанд нэмэх"
                style={({ pressed }) => [
                  styles.cartBtn,
                  { opacity: pressed ? 0.85 : 1, backgroundColor: c.primaryBg },
                ]}
              >
                <Feather name="shopping-bag" size={16} color={c.primaryFg} />
                <Text style={[styles.cartText, { color: c.primaryFg }]}>Сагслах</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text style={[styles.name, { color: fg }]}>Бүтээгдэхүүн олдсонгүй</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 12, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  heroImage: { width: '100%', height: 260, borderRadius: 24, marginBottom: 14 },
  name: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  price: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  desc: { fontSize: 12, fontWeight: '600', lineHeight: 18 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  heartBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cartText: { fontSize: 11, fontWeight: '900' },
});


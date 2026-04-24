import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { barbers, type Barber } from '../../lib/data/barbers';
import { products, type Product } from '../../lib/data/products';
import { getAppColors } from '../../lib/theme';
import { FONT_DISPLAY, HIT_SLOP_10 } from '../../lib/ui';
import { useCart } from '../../providers/CartProvider';
import { useWishlist } from '../../providers/WishlistProvider';

type HomeBannerProps = {
  isDark: boolean;
  onPress: () => void;
};

type HomeBarberSliderProps = {
  isDark: boolean;
  onPressCta: () => void;
  onPressBarber: (barber: Barber) => void;
};

type HomeBestSellerGridProps = {
  isDark: boolean;
  items: Product[];
  wishlistSlugs: ReadonlySet<string>;
  onToggleWishlist: (slug: string) => void;
  onPressProduct: (product: Product) => void;
  onPressAddToCart: (product: Product) => void;
};

const impactLight = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // web дээр хаптик ажиллахгүй байж болно
  }
};

const formatPrice = (priceMnt: number) => {
  return `${new Intl.NumberFormat('mn-MN').format(priceMnt)} ₮`;
};

const HomeBanner: React.FC<HomeBannerProps> = ({ isDark, onPress }) => {
  return (
    <Pressable
      onPress={async () => {
        await impactLight();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel="Цаг авах"
      style={({ pressed }) => [styles.bannerCard, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=400&fit=crop',
        }}
        style={styles.bannerImage}
        contentFit="cover"
      />

      {/* Доороосоо харанхуйлж тодруулах (gradient-тай төстэй) */}
      <View style={styles.bannerOverlay} pointerEvents="none">
        <View style={styles.bannerOverlayStrong} />
        <View style={styles.bannerOverlaySoft} />
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.bannerBorder,
          { borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)' },
        ]}
      />
    </Pressable>
  );
};

const HomeBarberSlider: React.FC<HomeBarberSliderProps> = ({
  isDark,
  onPressCta,
  onPressBarber,
}) => {
  const c = getAppColors(isDark ? 'dark' : 'light');
  const muted = isDark ? 'rgba(255,255,255,0.55)' : c.muted;
  const title = c.fg;
  const border = isDark ? 'rgba(255,255,255,0.20)' : c.divider;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={{ gap: 4 }}>
          <Text style={[styles.kicker, { color: muted }]}>БАБЕРУУД</Text>
          <Text
            style={[
              styles.sectionTitle,
              { color: title, fontFamily: FONT_DISPLAY },
            ]}
          >
            Манай баг
          </Text>
        </View>

        <Pressable
          onPress={async () => {
            await impactLight();
            onPressCta();
          }}
          accessibilityRole="button"
          accessibilityLabel="Цаг авах"
          style={({ pressed }) => [
            styles.outlineBtn,
            { borderColor: border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.outlineBtnText, { color: title }]}>Цаг авах →</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={barbers}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.barberList}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              // Барбер дээр дарвал шууд цаг авах руу
              await impactLight();
              onPressBarber(item);
            }}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} барбер дээр цаг авах`}
            style={({ pressed }) => [
              styles.barberCard,
              { opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.barberImage} contentFit="cover" />
            <View style={styles.barberOverlay} pointerEvents="none">
              <View style={styles.barberOverlayStrong} />
              <View style={styles.barberOverlaySoft} />
            </View>

            <View
              pointerEvents="none"
              style={[
                styles.barberInfoPill,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.60)',
                  borderColor: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.08)',
                },
              ]}
            >
              <Text style={[styles.barberName, { color: isDark ? '#fff' : '#09090b' }]}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.barberRole,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(9,9,11,0.60)' },
                ]}
              >
                {item.title}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const ProductCard: React.FC<{
  isDark: boolean;
  item: Product;
  wished: boolean;
  onToggleWishlist: () => void;
  onPress: () => void;
  onPressAddToCart: () => void;
}> = ({ isDark, item, wished, onToggleWishlist, onPress, onPressAddToCart }) => {
  const c = getAppColors(isDark ? 'dark' : 'light');
  const fg = c.fg;
  const border = c.cardBorder;

  return (
    <Pressable
      onPress={async () => {
        await impactLight();
        onPress();
      }}
      style={({ pressed }) => [
        styles.productCard,
        { borderColor: border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} contentFit="cover" />
      <Text style={[styles.productName, { color: fg }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.productPrice, { color: c.muted2 }]}>
        {formatPrice(item.priceMnt)}
      </Text>

      <View style={styles.productButtonsRow}>
        <Pressable
          onPress={async () => {
            await impactLight();
            onToggleWishlist();
          }}
          hitSlop={HIT_SLOP_10}
          accessibilityRole="button"
          accessibilityLabel={wished ? 'Хүслийн жагсаалтаас хасах' : 'Хүслийн жагсаалтад нэмэх'}
          style={({ pressed }) => [
            styles.heartBtn,
            { borderColor: border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="heart" size={18} color={wished ? '#ef4444' : fg} />
        </Pressable>

        <Pressable
          onPress={async () => {
            await impactLight();
            onPressAddToCart();
          }}
          accessibilityRole="button"
          accessibilityLabel="Сагсанд нэмэх"
          style={({ pressed }) => [
            styles.addToCartBtn,
            { opacity: pressed ? 0.85 : 1, backgroundColor: c.primaryBg },
          ]}
        >
          <Feather name="shopping-bag" size={16} color={c.primaryFg} />
          <Text style={[styles.addToCartText, { color: c.primaryFg }]}>Сагслах</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const HomeBestSellerGrid: React.FC<HomeBestSellerGridProps> = ({
  isDark,
  items,
  wishlistSlugs,
  onToggleWishlist,
  onPressProduct,
  onPressAddToCart,
}) => {
  const c = getAppColors(isDark ? 'dark' : 'light');
  const fg = c.fg;

  return (
    <View style={styles.section}>
      <Text style={[styles.bestTitle, { color: fg }]}>Шилдэг бүтээгдэхүүн</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ProductCard
            isDark={isDark}
            item={item}
            wished={wishlistSlugs.has(item.slug)}
            onToggleWishlist={() => onToggleWishlist(item.slug)}
            onPress={() => onPressProduct(item)}
            onPressAddToCart={() => onPressAddToCart(item)}
          />
        )}
      />
    </View>
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = getAppColors(isDark ? 'dark' : 'light');

  const { addItem } = useCart();
  const wishlist = useWishlist();

  const bestSellers = useMemo(() => products.slice(0, 4), []);

  const bg = c.bg;

  const pushBooking = () => {
    router.push('/(tabs)/booking');
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 16) + 6 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <HomeBanner isDark={isDark} onPress={pushBooking} />

      <HomeBarberSlider
        isDark={isDark}
        onPressCta={pushBooking}
        onPressBarber={() => pushBooking()}
      />

      <HomeBestSellerGrid
        isDark={isDark}
        items={bestSellers}
        wishlistSlugs={wishlist.slugs}
        onToggleWishlist={(slug) => wishlist.toggle(slug)}
        onPressProduct={(product) => router.push(`/shop/${product.slug}`)}
        onPressAddToCart={(product) => {
          addItem({
            slug: product.slug,
            name: product.name,
            priceMnt: product.priceMnt,
            imageUrl: product.imageUrl,
            quantity: 1,
          });
        }}
      />

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingBottom: 24,
  },

  bannerCard: {
    marginHorizontal: 16,
    height: 176,
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
  },
  bannerOverlayStrong: {
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  bannerOverlaySoft: {
    height: '45%',
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  bannerBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 26,
  },

  section: {
    marginTop: 18,
  },
  sectionHeaderRow: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kicker: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  outlineBtn: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },

  barberList: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 10,
  },
  barberCard: {
    width: 132,
    aspectRatio: 4 / 5,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 10,
  },
  barberImage: { width: '100%', height: '100%' },
  barberOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
  },
  barberOverlayStrong: {
    height: '70%',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  barberOverlaySoft: {
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  barberInfoPill: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  barberName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  barberRole: {
    fontSize: 8.5,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },

  bestTitle: {
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '800',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  productCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
  },
  productButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heartBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtn: {
    flex: 1,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addToCartText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#09090b',
  },
});


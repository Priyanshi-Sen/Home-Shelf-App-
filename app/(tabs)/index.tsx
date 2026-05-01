import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ShelfCategory = 'Kitchen' | 'Cleaning' | 'Bathroom' | 'Other';

type ShelfItem = {
  id: string;
  name: string;
  qty: number;
  category: ShelfCategory;
  needed: boolean;
};

const categories: ShelfCategory[] = ['Kitchen', 'Cleaning', 'Bathroom', 'Other'];

const starterItems: ShelfItem[] = [
  { id: 'rice', name: 'Rice', qty: 6, category: 'Kitchen', needed: false },
  { id: 'soap', name: 'Hand soap', qty: 2, category: 'Bathroom', needed: false },
  { id: 'detergent', name: 'Detergent', qty: 1, category: 'Cleaning', needed: true },
];

export default function Home() {
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState<ShelfCategory>('Kitchen');
  const [items, setItems] = useState<ShelfItem[]>(starterItems);
  const [filter, setFilter] = useState<'All' | ShelfCategory | 'Low'>('All');

  const visibleItems = useMemo(() => {
    if (filter === 'All') {
      return items;
    }

    if (filter === 'Low') {
      return items.filter((item) => item.qty <= 2 || item.needed);
    }

    return items.filter((item) => item.category === filter);
  }, [filter, items]);

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const lowCount = items.filter((item) => item.qty <= 2 || item.needed).length;

  const addItem = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setItems((currentItems) => [
      {
        id: `${Date.now()}-${trimmedName}`,
        name: trimmedName,
        qty,
        category,
        needed: qty <= 2,
      },
      ...currentItems,
    ]);
    setName('');
    setQty(1);
    setCategory('Kitchen');
  };

  const updateQty = (id: string, change: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextQty = Math.max(0, item.qty + change);

        return {
          ...item,
          qty: nextQty,
          needed: nextQty <= 2,
        };
      }),
    );
  };

  const toggleNeeded = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, needed: !item.needed } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>HomeShelf</Text>
            <Text style={styles.title}>Pantry and home stock</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeNumber}>{items.length}</Text>
            <Text style={styles.headerBadgeLabel}>Items</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPanel}>
            <Text style={styles.statValue}>{totalQty}</Text>
            <Text style={styles.statLabel}>Units stored</Text>
          </View>
          <View style={styles.statPanel}>
            <Text style={styles.statValue}>{lowCount}</Text>
            <Text style={styles.statLabel}>Need attention</Text>
          </View>
        </View>

        <View style={styles.formPanel}>
          <TextInput
            placeholder="Item name"
            placeholderTextColor="#8B8178"
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            onSubmitEditing={addItem}
            style={styles.input}
          />

          <View style={styles.categoryRow}>
            {categories.map((categoryName) => (
              <Pressable
                key={categoryName}
                onPress={() => setCategory(categoryName)}
                style={[
                  styles.categoryButton,
                  category === categoryName && styles.categoryButtonActive,
                ]}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === categoryName && styles.categoryButtonTextActive,
                  ]}>
                  {categoryName}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.quantityHeader}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <Text style={styles.quantityValue}>{qty}</Text>
          </View>
          <Slider
            minimumValue={1}
            maximumValue={20}
            minimumTrackTintColor="#346C5B"
            maximumTrackTintColor="#DED7CD"
            step={1}
            value={qty}
            onValueChange={setQty}
          />

          <Pressable onPress={addItem} style={styles.addButton}>
            <Ionicons name="add" size={20} color="#FFFDF8" />
            <Text style={styles.addButtonText}>Add item</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          {(['All', ...categories, 'Low'] as const).map((filterName) => (
            <Pressable
              key={filterName}
              onPress={() => setFilter(filterName)}
              style={[
                styles.filterButton,
                filter === filterName && styles.filterButtonActive,
              ]}>
              <Text
                style={[
                  styles.filterButtonText,
                  filter === filterName && styles.filterButtonTextActive,
                ]}>
                {filterName}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyPanel}>
              <Text style={styles.emptyTitle}>No matching items</Text>
              <Text style={styles.emptyText}>Add something or switch filters.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemMain}>
                <View
                  style={[
                    styles.statusDot,
                    item.needed && styles.statusDotNeeded,
                  ]}
                />
                <View style={styles.itemTextBlock}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.category}</Text>
                </View>
              </View>

              <View style={styles.itemActions}>
                <Pressable
                  accessibilityLabel={`Decrease ${item.name}`}
                  onPress={() => updateQty(item.id, -1)}
                  style={styles.iconButton}>
                  <Ionicons name="remove" size={18} color="#2E3834" />
                </Pressable>
                <Text style={styles.itemQty}>{item.qty}</Text>
                <Pressable
                  accessibilityLabel={`Increase ${item.name}`}
                  onPress={() => updateQty(item.id, 1)}
                  style={styles.iconButton}>
                  <Ionicons name="add" size={18} color="#2E3834" />
                </Pressable>
                <Pressable
                  accessibilityLabel={`Toggle shopping need for ${item.name}`}
                  onPress={() => toggleNeeded(item.id)}
                  style={[
                    styles.iconButton,
                    item.needed && styles.iconButtonActive,
                  ]}>
                  <Ionicons
                    name={item.needed ? 'cart' : 'cart-outline'}
                    size={17}
                    color={item.needed ? '#FFFDF8' : '#2E3834'}
                  />
                </Pressable>
                <Pressable
                  accessibilityLabel={`Remove ${item.name}`}
                  onPress={() => removeItem(item.id)}
                  style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={17} color="#8F483E" />
                </Pressable>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1E8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eyebrow: {
    color: '#346C5B',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#242824',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 4,
  },
  headerBadge: {
    alignItems: 'center',
    backgroundColor: '#2F463E',
    borderRadius: 8,
    minWidth: 68,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerBadgeNumber: {
    color: '#FFFDF8',
    fontSize: 20,
    fontWeight: '800',
  },
  headerBadgeLabel: {
    color: '#DCE8E2',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statPanel: {
    backgroundColor: '#FFFDF8',
    borderColor: '#E4DCCD',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  statValue: {
    color: '#2F463E',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: '#766E64',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  formPanel: {
    backgroundColor: '#FFFDF8',
    borderColor: '#E4DCCD',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  input: {
    backgroundColor: '#F7F2EA',
    borderColor: '#DDD2C5',
    borderRadius: 8,
    borderWidth: 1,
    color: '#242824',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#F7F2EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryButtonActive: {
    backgroundColor: '#346C5B',
  },
  categoryButtonText: {
    color: '#5A534C',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryButtonTextActive: {
    color: '#FFFDF8',
  },
  quantityHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    color: '#5A534C',
    fontSize: 14,
    fontWeight: '700',
  },
  quantityValue: {
    color: '#242824',
    fontSize: 16,
    fontWeight: '800',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#346C5B',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  addButtonText: {
    color: '#FFFDF8',
    fontSize: 16,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#E9E0D3',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2F463E',
  },
  filterButtonText: {
    color: '#5A534C',
    fontSize: 12,
    fontWeight: '800',
  },
  filterButtonTextActive: {
    color: '#FFFDF8',
  },
  listContent: {
    gap: 10,
    paddingBottom: 28,
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderColor: '#E4DCCD',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 12,
  },
  itemMain: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minWidth: 0,
  },
  statusDot: {
    backgroundColor: '#76A58E',
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  statusDotNeeded: {
    backgroundColor: '#C77759',
  },
  itemTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    color: '#242824',
    fontSize: 16,
    fontWeight: '800',
  },
  itemMeta: {
    color: '#766E64',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  itemActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#F0E8DD',
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  iconButtonActive: {
    backgroundColor: '#C77759',
  },
  itemQty: {
    color: '#242824',
    fontSize: 16,
    fontWeight: '900',
    minWidth: 24,
    textAlign: 'center',
  },
  emptyPanel: {
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderColor: '#E4DCCD',
    borderRadius: 8,
    borderWidth: 1,
    padding: 22,
  },
  emptyTitle: {
    color: '#242824',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: '#766E64',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});

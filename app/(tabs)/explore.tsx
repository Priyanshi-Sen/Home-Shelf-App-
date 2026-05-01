import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const shoppingGroups = [
  {
    title: 'This week',
    items: ['Detergent', 'Dish sponge', 'Toothpaste'],
    color: '#C77759',
  },
  {
    title: 'Pantry watch',
    items: ['Rice below 3 units', 'Cooking oil halfway', 'Tea bags running low'],
    color: '#346C5B',
  },
  {
    title: 'Home reset',
    items: ['Check bathroom shelf', 'Restock cleaners', 'Review expired items'],
    color: '#6E668A',
  },
];

export default function ShoppingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>HomeShelf</Text>
          <Text style={styles.title}>Shopping plan</Text>
          <Text style={styles.subtitle}>
            Keep the next restock simple with grouped household priorities.
          </Text>
        </View>

        <View style={styles.heroPanel}>
          <View style={styles.heroIcon}>
            <Ionicons name="cart" size={28} color="#FFFDF8" />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroNumber}>9</Text>
            <Text style={styles.heroLabel}>Suggested checks</Text>
          </View>
        </View>

        {shoppingGroups.map((group) => (
          <View key={group.title} style={styles.groupPanel}>
            <View style={styles.groupHeader}>
              <View style={[styles.groupDot, { backgroundColor: group.color }]} />
              <Text style={styles.groupTitle}>{group.title}</Text>
            </View>
            {group.items.map((item) => (
              <View key={item} style={styles.groupItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color={group.color} />
                <Text style={styles.groupItemText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1E8',
  },
  container: {
    padding: 18,
    paddingBottom: 32,
  },
  header: {
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
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: 4,
  },
  subtitle: {
    color: '#766E64',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 8,
  },
  heroPanel: {
    alignItems: 'center',
    backgroundColor: '#2F463E',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    padding: 18,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: '#346C5B',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  heroText: {
    flex: 1,
  },
  heroNumber: {
    color: '#FFFDF8',
    fontSize: 28,
    fontWeight: '900',
  },
  heroLabel: {
    color: '#DCE8E2',
    fontSize: 14,
    fontWeight: '700',
  },
  groupPanel: {
    backgroundColor: '#FFFDF8',
    borderColor: '#E4DCCD',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  groupHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  groupDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  groupTitle: {
    color: '#242824',
    fontSize: 17,
    fontWeight: '800',
  },
  groupItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
  },
  groupItemText: {
    color: '#4E4740',
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});

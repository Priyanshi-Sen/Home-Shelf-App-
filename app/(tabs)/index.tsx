import Slider from '@react-native-community/slider';
import { useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Home() {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState(1);
  const [list, setList] = useState([]);

  const addItem = () => {
    if (!item) return;
    setList([...list, { id: Date.now().toString(), name: item, qty }]);
    setItem('');
    setQty(1);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F5F1EB',
      padding: 20
    }}>

      {/* Title */}
      <Text style={{
        fontSize: 28,
        fontWeight: '600',
        color: '#3E3E3E',
        marginBottom: 20
      }}>
        HomeShelf 🧺
      </Text>

      {/* Input Box */}
      <View style={{
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20
      }}>
        <TextInput
          placeholder="Add item..."
          value={item}
          onChangeText={setItem}
          style={{
            fontSize: 16,
            marginBottom: 10
          }}
        />

        <Text style={{ color: '#777' }}>
          Quantity: {qty}
        </Text>

        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={qty}
          onValueChange={setQty}
        />

        <TouchableOpacity
          onPress={addItem}
          style={{
            backgroundColor: '#C8B6A6',
            padding: 12,
            borderRadius: 10,
            marginTop: 10
          }}
        >
          <Text style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: '600'
          }}>
            Add Item
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: '#FFFFFF',
            padding: 15,
            borderRadius: 12,
            marginBottom: 10
          }}>
            <Text style={{
              fontSize: 16,
              color: '#333'
            }}>
              {item.name} (x{item.qty})
            </Text>
          </View>
        )}
      />

    </View>
  );
}
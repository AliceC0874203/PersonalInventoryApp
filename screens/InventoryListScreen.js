import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeout from 'react-native-swipeout';

const InventoryListScreen = ({ navigation }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sorted, setSorted] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadInventoryItems();
    });
    return unsubscribe;
  }, [navigation]);

  const loadInventoryItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      let inventory = items.map(item => JSON.parse(item[1])).filter(item => item !== null);
      if (sorted) {
        inventory = inventory.sort((a, b) => a.name.localeCompare(b.name));
      }
      setInventoryItems(inventory);
      setFilteredItems(inventory); // Also set the filtered items
    } catch (error) {
      Alert.alert('Error', 'Failed to load the inventory items.');
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filtered = inventoryItems.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        String(item.id).toLowerCase().includes(text.toLowerCase()) ||
        String(item.quantity).toLowerCase().includes(text.toLowerCase()) ||
        String(item.price).toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(inventoryItems);
    }
  };

  const handleSort = () => {
    let sortedItems = [...filteredItems];
    if (sorted) {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    }
    setFilteredItems(sortedItems);
    setSorted(!sorted);
  };

  const deleteItem = async (id) => {
    await AsyncStorage.removeItem(`item_${id}`);
    loadInventoryItems(); // Refresh the list after deletion
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteItem(id) },
    ]);
  };

  const renderItem = ({ item }) => {
    const swipeoutButtons = [
      {
        text: 'Edit',
        backgroundColor: '#FFA500',
        onPress: () => navigation.navigate('AddItem', { item }),
      },
      {
        text: 'Delete',
        backgroundColor: '#FF4500',
        onPress: () => confirmDelete(item.id),
      },
    ];

    return (
      <Swipeout right={swipeoutButtons} autoClose={true} backgroundColor='transparent'>
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('InventoryDetail', { item })}>
          <Image source={{ uri: item.image }} style={styles.thumbnail} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Qty: {item.quantity}</Text>
            <Text style={styles.itemDetails}>Price: ${item.price}</Text>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search by name, id, quantity, price..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
          <Text style={styles.sortButtonText}>{sorted ? 'Descending' : 'Ascending'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchBox: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  sortButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  thumbnail: {
    backgroundColor: 'lightgray',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#e4e4e4',
  },
});

export default InventoryListScreen;

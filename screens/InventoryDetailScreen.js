import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const InventoryDetailScreen = ({ route, navigation }) => {
  const [item, setItem] = useState(route.params.item);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // If there's an update function passed in params, call it
      if (route.params?.onSave) {
        const updatedItem = route.params?.item;
        updateItem(updatedItem);
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params]);

  const handleEdit = () => {
    navigation.navigate('AddEditItem', {
      item: item,
      onSave: updateItem, // Pass a callback function to update the item
    });
  };

  const updateItem = (updatedItem) => {
    setItem(updatedItem);
  };

  const handleDelete = async () => {
    // Confirm before deleting
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel" },
      { 
        text: "Delete", 
        onPress: async () => {
          await AsyncStorage.removeItem(`item_${item.id}`);
          navigation.goBack();
        }
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>No Image Available</Text>
          </View>
        )}
        <View style={styles.detailCard}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.detail}>Quantity: {item.quantity}</Text>
          <Text style={styles.detail}>Price: {item.price ? `$${item.price}` : '-'}</Text>
          <Text style={styles.detail}>Description: {item.description ? item.description : '-'}</Text>
          <Text style={styles.detailTiny}>ID: {item.id}</Text>

          <View style={styles.floatingActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.floatingButton}>
            <Ionicons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={[styles.floatingButton, styles.deleteButton]}>
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '90%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  detailCard: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detail: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
  },
  detailTiny: {
    fontSize: 10,
    color: 'lightgray',
    marginTop: 4,
    marginBottom: 4,
  },
  floatingActions: {
    position: 'absolute',
    right: 10,
    top: 200, 
    alignItems: 'center',
  },
  floatingButton: {
    backgroundColor: '#4169E1', // A nice blue color
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#FF6347', // A nice red color
  },
});

export default InventoryDetailScreen;

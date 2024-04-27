import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const AddEditItemScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (route.params?.item) {
      const { item } = route.params;
      setName(item.name);
      setQuantity(String(item.quantity));
      setPrice(String(item.price));
      setDescription(item.description);
      setImage(item.image);
      setIsEdit(true);
    }
  }, [route.params?.item]);

  const handleSave = async () => {
    if (!name || !quantity || !price || !image) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Quantity, Price, Photo).');
      return;
    }

    //check if price and quantity are numbers
    if (isNaN(quantity) || isNaN(price)) {
      Alert.alert('Error', 'Quantity and Price must be numbers.');
      return;
    }

    const newItem = {
      id: isEdit ? route.params.item.id : Date.now().toString(),
      name,
      quantity: parseInt(quantity, 10),
      price,
      description,
      image,
    };

    await AsyncStorage.setItem(`item_${newItem.id}`, JSON.stringify(newItem));

    // Call the callback function with the new item data after saving
    if (route.params?.onSave) {
      route.params.onSave(newItem);
    }

    navigation.goBack();
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Item Name*"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity*"
          keyboardType="number-pad"
          value={quantity}
          onChangeText={setQuantity}
        />
        <TextInput
          style={styles.input}
          placeholder="Price*"
          keyboardType="number-pad"
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.multilineInput}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Choose Photo</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>{isEdit ? "Update Item" : "Add Item"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  form: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    height: 50,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5C6BC0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#42A5F5',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default AddEditItemScreen;

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import InventoryListScreen from './screens/InventoryListScreen';
// import InventoryDetailScreen from './screens/InventoryDetailScreen';
// import AddEditItemScreen from './screens/AddEditItemScreen';
// import { Ionicons } from '@expo/vector-icons';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// // Stack Navigator for the Inventory List and Detail View
// function InventoryStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="InventoryList"
//         component={InventoryListScreen}
//         options={{ title: 'Item List' }} // Hide the header for the InventoryList as it's handled by the tab navigator
//       />
//       <Stack.Screen
//         name="InventoryDetail"
//         component={InventoryDetailScreen}
//         options={{
//           title: 'Item Details',
//         }}
//       />
//       <Stack.Screen
//         name="AddEditItem"
//         component={AddEditItemScreen}
//         options={({ route }) => ({ title: route.params?.item ? 'Edit Item' : 'Add Item' })}
//       />
//     </Stack.Navigator>
//   );
// }

// // Tab Navigator for switching between the Inventory List and Add Item views
// function InventoryTab() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'InventoryListTab') {
//             iconName = focused ? 'list' : 'list';
//           } else if (route.name === 'AddEditItemTab') {
//             iconName = focused ? 'add-circle' : 'add-circle-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//       tabBarOptions={{
//         activeTintColor: 'tomato',
//         inactiveTintColor: 'gray',
//       }}
//     >
//       <Tab.Screen
//         name="InventoryListTab"
//         component={InventoryStack}
//         options={{ title: 'List',  headerShown: false }} // Set the title for the tab bar
//       />
//       <Tab.Screen
//         name="AddEditItemTab"
//         component={AddEditItemScreen}
//         options={{ title: 'Add Item', unmountOnBlur: true }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Drawer Navigator wraps the Tab Navigator
// function DrawerNavigator() {
//   return (
//     <Drawer.Navigator initialRouteName="Personal Inventory">
//       <Drawer.Screen name="Personal Inventory" component={InventoryTab} options={{ drawerLabel: 'Item List' }} />
//       {/* Add more screens if you have any */}
//     </Drawer.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <DrawerNavigator />
//     </NavigationContainer>
//   );
// }

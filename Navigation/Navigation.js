import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../Components/Search';
import FilmDetail from '../Components/FilmDetail';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Favorites from '../Components/Favorites';


const Stack = createStackNavigator();

function MyStack() {
    return (

        <Stack.Navigator
            style={styles.stackNavigator}
            initialRouteName="Home"
            screenOptions={{
            }}
        >
            <Stack.Screen
                style={styles.stackNavigator}

                name="Home"
                component={Search}
                options={{
                    title: 'test',
                    headerShown: false
                }}
            />
            <Stack.Screen style={styles.Title}
                name="FilmDetail"
                component={FilmDetail}
                options={{
                    title: 'Détail du film',
                    headerShown: false
                }}
            />
        </Stack.Navigator>

    );
}


const Tab = createBottomTabNavigator();

export default function BottonTab() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Rechercher" component={MyStack}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="search" size={24} color="black" />
                        ),
                    }}
                />
                <Tab.Screen name="Favoris" component={Favorites}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <AntDesign name="heart" size={24} color="black" />
                        ),
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({

    main_container: {
        color: "black"
    },
    stackNavigator: {
        height: 0,
        display: 'none'
    }
})
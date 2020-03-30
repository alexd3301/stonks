import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, Linking} from 'react-native';
import TabBarIcon from '../../components/TabBarIcon';
import { FlatList } from 'react-native-gesture-handler';

// Beginner-level stocks
const DATA = [
  {
    id: '1',
    title: 'NYSE:HRL',
  },
  {
    id: '2',
    title: 'NYSE:EPD',
  },
  {
    id: '3',
    title: 'NYSE:VER',
  },
  {
    id: '4',
    title: 'NYSE:T',
  },
  {
    id: '5',
    title: 'NASDAQ:INTC',
  },
  {
    id: '6',
    title: 'NASDAQ:AAPL',
  },
];

function Item({ title }) {
  return (
    <View style={styles.item}>
      {/* Display the chart icon and the title of the stock */}
      <TabBarIcon name="chart-line"/>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Create a list to show all 6 stocks */}
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    backgroundColor: '#74c284',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  }
});
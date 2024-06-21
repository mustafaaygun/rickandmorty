import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';

interface Items {
  name: string
}
interface Root {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: Origin
  location: Location
  image: string
  episode: string[]
  url: string
  created: string
}

interface Origin {
  name: string
  url: string
}

interface Location {
  name: string
  url: string
}

type ItemProps = { id: number, name: string, imageUri: string, status: string, species: string, locationName: string, orignName: string };
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';



  const [data, setData] = useState<Root[]>([])

  const [filterVisible, setFilterVisible] = useState<boolean>(false)

  const [orign, setOrign] = useState<Items[]>([])
  const [location, setLocation] = useState<Items[]>([])
  const [selectedOrignItems, setSelectedOrignItems] = useState<string[]>([])
  const [selectedLocationItems, setSelectedLocationItems] = useState<string[]>([])
  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    try {
      const req = await axios.get('https://rickandmortyapi.com/api/character');
      const data = req.data.results as Root[];
      const arrOrign = [... new Set(data.map((item) => item.origin.name))];
      const arrLocation = [... new Set(data.map((item) => item.location.name))];
      setData(data);
      let orignArr: Items[] = [];
      let locationArr: Items[] = [];
      arrOrign.forEach(element => {
        orignArr.push({ name: element });
      });

      arrLocation.forEach(element => {
        locationArr.push({ name: element });
      });
      setOrign(orignArr)
      setLocation(locationArr)
    } catch (error) {
      console.log(error)
    }

  }
  const setVisibility = () => {
    setFilterVisible(!filterVisible);
  }
  const onSelectedItemsChange = (selectedItems: string[]) => {
    setSelectedOrignItems(selectedItems);
  }

  const onSelectedLocationItemsChange = (selectedItems: string[]) => {
    setSelectedLocationItems(selectedItems);
  }
  const Filter = (): React.JSX.Element => {
    return (
      <>
        <View style={{ padding:8}}>
          <MultiSelect
            items={orign}
            uniqueKey="name"
            onSelectedItemsChange={onSelectedItemsChange}
            selectText="First See In"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={(text) => console.log("")}
            altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
            selectedItems={selectedOrignItems}
            filterMethod='full'
          />

          <MultiSelect
            items={location}
            uniqueKey="name"
            onSelectedItemsChange={onSelectedLocationItemsChange}
            selectText="Last Known Location"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={(text) => console.log("")}
            altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
            selectedItems={selectedLocationItems}
            filterMethod='full'
          />

        </View>
        <View style={{ height: 5, backgroundColor: '#DE5C2B' }}></View>
      </>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}

      />

      <View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={{ padding: 10 }}>Sıralama</Text>
          </TouchableOpacity>
          <View style={{ padding: 3 }}></View>
          <TouchableOpacity onPress={() => setVisibility()} style={[styles.button, { backgroundColor: filterVisible ? '#DE5C2B' : '#fff' }]}>
            <Text style={{ padding: 10, color: filterVisible ? '#fff' : '#000' }}>Filtreleme</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 5, backgroundColor: '#DE5C2B' }}></View>
        {filterVisible == true ? <Filter /> : <></>}

      </View>
      <FlatList
      style={{backgroundColor:'#d1d1d1'}}
        data={data.filter(x =>
          (
            (selectedOrignItems.length == 0) ||
            (selectedOrignItems.length > 0 && selectedOrignItems.some(r => x.origin.name.includes(r)))
          )
          &&
          (
            (selectedLocationItems.length == 0) ||
            (selectedLocationItems.length > 0 && selectedLocationItems.some(r => x.location.name.includes(r)))
          )
        )}
        renderItem={({ item }) => <Item id={item?.id} name={item?.name} imageUri={item?.image} status={item?.status} species={item?.species} locationName={item?.location?.name} orignName={item?.origin?.name} />}
        keyExtractor={item => item.id.toString()}
      />

    </SafeAreaView>
  );
}

const Item = ({ id, name, imageUri, status, species, locationName, orignName }: ItemProps) => (
  <View style={styles.item}>
    <Image source={{ uri: imageUri }} style={{ minWidth: 100, minHeight: 100 }} />
    <View style={{ marginLeft: 15, paddingVertical: 10, flex: 1 }}>
      <Text style={styles.title} ellipsizeMode='head'>{name}</Text>
      <Text style={styles.font}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: status == "Alive" ? "green" : "red" }}><Text> </Text></View> {status} - {species}</Text>
      <Text style={styles.font2}>Last known location: </Text>
      <Text style={styles.font}>{locationName}</Text>
      <Text style={styles.font2}>First seen in: </Text>
      <Text style={styles.font}>{orignName}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#272b33',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  title: {
    fontSize: 25,
    color: '#fff',
    overflow: 'hidden'
  },
  font: {
    color: '#fff'
  },
  font2: {
    color: '#9e9e9e',
    marginTop: 10
  },
  button: {
    borderColor: '#000',
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 10
  }
});

export default App;

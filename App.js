import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = "8557398059eb2d1f2f8ba20e4c629a48";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "day-cloudy",
  Snow: "snow",
  Rain:"rains",
  Drizzle:"rain",
  Thunderstorm:"lightning",
}

export default function App() {
  const [city, setCity] = useState("...Loading");
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [ok, setOk] = useState(true);
  
  const ask = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted)
      setOk(false);
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({ latitude, longitude },{useGoogleMaps:false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&lang=kr&units=metric&appid=${API_KEY}`)
    const data = await response.json();
    setDays(data.daily);
  }
  
  useEffect(() => {
    ask()
  },[])
  
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>Seoul</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} style={styles.weather}>
        {days.length===0?
        <View style={styles.day}>
          <ActivityIndicator color="white" size="large" style={{marginTop: 10}} />
        </View>:
        days.map((day,index) => {
          return (
            <View style={styles.day}>
              <View style={{flexDirection:"row",alignItems:"center", width:"100%", justifyContent:"space-between"}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={24} color="black" />
              </View>
          
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )
        })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent:"center",
    alignItems:"center"
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize:100,
  },
  description: {
    marginTop:-30,
    fontSize:60,
  },
  tinyText: {
    fontSize:30,
  }
});

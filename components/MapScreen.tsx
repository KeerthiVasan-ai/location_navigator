import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  Linking,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

interface LocationType {
  latitude: number;
  longitude: number;
}

interface SuggestionType {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

const MapScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LocationType[]>([]);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [loadingRoute, setLoadingRoute] = useState<boolean>(false);
  const [loadingUserLocation, setLoadingUserLocation] = useState<boolean>(true);
  const [buttonState, setButtonState] = useState<string>("Direction");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required.");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert("Error", "Unable to fetch user location.");
      } finally {
        setLoadingUserLocation(false);
      }
    })();
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length > 2) {
      setLoadingSuggestions(true);
      try {
        const response = await axios.get<SuggestionType[]>(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
          {
            headers: {
              "User-Agent": "React Native App - Educational Usage",
            },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        Alert.alert("Error", "Unable to fetch suggestions. Try again later.");
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const fetchRoute = async () => {
    if (!userLocation || !selectedLocation) {
      Alert.alert("Error", "User or destination location is missing.");
      return;
    }

    setLoadingRoute(true);
    try {
      const response = await axios.get<any>(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          params: {
            api_key: "5b3ce3597851110001cf62484d788bc641f140759c178ab03adcbcf9",
            start: `${userLocation.longitude},${userLocation.latitude}`,
            end: `${selectedLocation.longitude},${selectedLocation.latitude}`,
          },
        }
      );
      const coordinates = response.data.features[0].geometry.coordinates.map(
        ([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })
      );
      setRouteCoordinates(coordinates);
      setButtonState("Start Navigation");
    } catch (error) {
      Alert.alert("Error", "Unable to fetch route. Try again later.");
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    fetchSuggestions(text);
  };

  const handleLocationSelect = (location: SuggestionType) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    setSelectedLocation({ latitude: lat, longitude: lon });
    setSearchQuery(location.display_name);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const handleMapPress = (e: any) => {
    setSelectedLocation(e.nativeEvent.coordinate);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleNavigate = () => {
    if (!userLocation || !selectedLocation) {
      Alert.alert("Error", "User or destination location is missing.");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${selectedLocation.latitude},${selectedLocation.longitude}&travelmode=driving`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Unable to open Google Maps.")
    );
    setButtonState("Stop Navigation");
  };

  const handleStopNavigation = () => {
    setButtonState("Direction");
    setRouteCoordinates([]);
    setSelectedLocation(null);
  };

  const handleClearDestination = () => {
    setSearchQuery("");
    setSelectedLocation(null);
    setRouteCoordinates([]);
    setButtonState("Direction");
  };

  const handleButtonPress = () => {
    if (buttonState === "Direction") {
      fetchRoute();
    } else if (buttonState === "Start Navigation") {
      handleNavigate();
    } else if (buttonState === "Stop Navigation") {
      handleStopNavigation();
    }
  };

  return (
    <View style={styles.container}>
      {loadingUserLocation && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      )}

      {/* Search Input */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a destination..."
        value={searchQuery}
        onChangeText={handleSearchChange}
      />

      {/* Suggestions List */}
      {loadingSuggestions ? (
        <ActivityIndicator size="small" color="#0000ff" style={styles.loading} />
      ) : (
        suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <Text
                style={styles.suggestion}
                onPress={() => handleLocationSelect(item)}
              >
                {item.display_name}
              </Text>
            )}
          />
        )
      )}

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={
          userLocation
            ? ({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              } as Region)
            : ({
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              } as Region)
        }
        onPress={handleMapPress}
      >
        {/* User Location */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}

        {/* Selected Location */}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            description="This is your chosen destination."
          />
        )}

        {/* Route */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#0000FF"
            strokeWidth={4}
          />
        )}
      </MapView>

      {loadingRoute && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            buttonState === "Start Navigation"
              ? styles.buttonBlue
              : buttonState === "Stop Navigation"
              ? styles.buttonRed
              : styles.buttonDefault,
          ]}
          onPress={handleButtonPress}
        >
          <Text style={styles.buttonText}>{buttonState}</Text>
        </TouchableOpacity>
        {selectedLocation && (
          <TouchableOpacity
            style={[styles.button, styles.buttonGray]}
            onPress={handleClearDestination}
          >
            <Text style={styles.buttonText}>Clear Destination</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: "white",
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDefault: {
    backgroundColor: "gray",
  },
  buttonBlue: {
    backgroundColor: "blue",
  },
  buttonRed: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonGray: {
    backgroundColor: "gray",
  },
});

export default MapScreen;

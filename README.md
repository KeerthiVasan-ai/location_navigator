# React Native Navigation App with OpenStreetMap and Google Maps Integration

This project is a single-page React Native application built with Expo, integrating OpenStreetMap (OSM) for map functionalities and Google Maps for navigation. The app enables users to search for a destination, plot routes, and start navigation seamlessly.

## Features

1. **Search Destination**  
   - Search destinations using OpenStreetMap's Nominatim API.  
   - Auto-suggestions for search queries.  

2. **Dynamic Route Plotting**  
   - Plot routes between the user's current location and the selected destination using OpenRouteService API.

3. **Start Navigation**  
   - Open Google Maps to navigate to the selected destination.

4. **Reset Destination**  
   - Users can reset their destination and route without restarting the app.

5. **Live User Location**  
   - Fetch and display the user's current location in real time.

6. **Dynamic Button State**  
   - Buttons adapt based on the user's actions:
     - `Direction`: Fetch and display the route.
     - `Start Navigation`: Open Google Maps for navigation.
     - `Stop Navigation`: Reset the app's state.

## Prerequisites

1. Install [Node.js](https://nodejs.org/).
2. Install [Expo CLI](https://docs.expo.dev/get-started/installation/).
3. Obtain API keys for:
   - OpenRouteService (for route plotting).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KeerthiVasan-ai/location_navigator.git
   cd location_navigator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. **Search for a Destination**  
   - Type a destination in the search bar to get suggestions.  

2. **Select a Destination**  
   - Choose from the suggestions or tap directly on the map.

3. **Plot a Route**  
   - Click the `Direction` button to plot a route between your current location and the selected destination.

4. **Navigate**  
   - After the route is displayed, click `Start Navigation` to open Google Maps.  
   - Follow the directions in Google Maps to reach your destination.  

5. **Reset Destination**  
   - Use the `Clear Destination` button to reset the destination and route.

## Project Structure

- `App.js`: Main application logic.
- `MapView`: Displays the map and handles markers and routes.
- `Search Bar`: Allows users to search for destinations.

## APIs Used

1. **OpenStreetMap Nominatim API**  
   - Provides location search and suggestions.  

2. **OpenRouteService API**  
   - Generates routes between two points.  

3. **Google Maps**  
   - Opens for turn-by-turn navigation.

## Screenshots
![Screenshot_2024-12-21-15-49-29-759_host exp exponent](https://github.com/user-attachments/assets/b60920f1-4c65-4819-acbe-d40ca924be04)

**1. Search Destination**  
![Search Destination Screenshot](https://github.com/user-attachments/assets/bd614a45-75ef-469a-80f8-a0cd2c0e832e)
)

**2. Plot Route**
![Plot Route Screenshot](https://github.com/user-attachments/assets/9712a575-4e93-433f-8aa2-2b2889a2fd92)

**3. Navigation in Google Maps**  
![Google Maps Screenshot](https://github.com/user-attachments/assets/982e69de-29ca-4eec-a448-93aac471f1f6)

**4. Exit Navigation**
![Exit Navigation Screenshot](https://github.com/user-attachments/assets/ff9cc147-2811-46b5-bf3c-cefb029dbc8e)


## Dependencies

- `react-native-maps`
- `expo-location`
- `axios`

## Acknowledgments

- [Expo](https://expo.dev/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [OpenRouteService](https://openrouteservice.org/)
- [Google Maps](https://maps.google.com/)

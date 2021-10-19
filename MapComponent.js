import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, PermissionsAndroid } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
 
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
 
const GOOGLE_MAPS_APIKEY = 'AIzaSyAYPWmPHaQjf6-trHHVrV-KE10YhJQkZ6E';
 
class MapComponent extends Component {
 
  constructor(props) {
    super(props);
 
    // AirBnB's Office, and Apple Park
    this.state = {
      coordinates: [
        {
          latitude: 32.779167,
          longitude: -96.808891,
        },
        {
          latitude: 37.771707,
          longitude: -122.4053769,
        },
      ],
    };    

    Geolocation.getCurrentPosition(info => {
        this.setState({coordinates: [
            {latitude: info.coords.latitude, longitude: info.coords.longitude}, 
            this.state.coordinates[1]]});
    });
 
    this.mapView = null;
  }
 
  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }
 
  render() {
    return (
        <View style={{flex: 1, backgroundColor: 'white', height: Dimensions.get("window").height}}><Text>Cool Maps DEMO(by Anton)</Text>
            <MapView
                initialRegion={{
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                }}
                style={{flex:1}}
                ref={c => this.mapView = c}
                onPress={this.onMapPress}
            >
                {this.state.coordinates.map((coordinate, index) =>
                <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
                )}
                {(this.state.coordinates.length >= 2) && (
                <MapViewDirections
                    origin={this.state.coordinates[0]}
                    waypoints={
                        this.state.coordinates
                    }
                    destination={this.state.coordinates[this.state.coordinates.length-1]}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="hotpink"
                    optimizeWaypoints={true}
                    onStart={(params) => {
                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                    console.log(`Distance: ${result.distance} km`)
                    console.log(`Duration: ${result.duration} min.`)
        
                    this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                        right: (width / 20),
                        bottom: (height / 20),
                        left: (width / 20),
                        top: (height / 20),
                        }
                    });
                    }}
                    onError={(errorMessage) => {
                    // console.log('GOT AN ERROR');
                    }}
                />
                )}
            </MapView>
        </View>
      
    );
  }
}
 
export default MapComponent;
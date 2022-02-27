import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import ReactPlayer from 'react-player';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hlZnlldW0iLCJhIjoiY2wwNDQ2ZjFxMGR4czNxcGRxdDlsODQwdCJ9.j3HMK_j8BvB-EpAMe76wAQ';


const UA_COORDINATES = {
  'latitude': 49.34051271789116,
  'longitude': 31.21759249962616
};

export default function App() {
  const [showPopup, setShowPopup] = React.useState(true);

  return (
    <div className='map-container'>
      <Map
        initialViewState={{
          latitude: UA_COORDINATES.latitude,
          longitude: UA_COORDINATES.longitude,
          zoom: 5.8
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Popup longitude={UA_COORDINATES.longitude} latitude={UA_COORDINATES.latitude}
          anchor="bottom"
          onClose={() => setShowPopup(false)}>
          Video goes here
        </Popup>
      </Map>
    </div>);
}
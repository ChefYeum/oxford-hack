/* global document */
import * as React from 'react';
import Map, { Marker } from 'react-map-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hlZnlldW0iLCJhIjoiY2wwNDQ2ZjFxMGR4czNxcGRxdDlsODQwdCJ9.j3HMK_j8BvB-EpAMe76wAQ';

export default function App() {
  return (
    <div className='map-container'>
      <Map
        initialViewState={{
          latitude: 37.8,
          longitude: -122.4,
          zoom: 14
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={-100} latitude={40} anchor="bottom" >
          <img src='https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg' />
        </Marker>

      </Map>
    </div>
  );
}


// export default function App() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [lng, setLng] = useState(-70.9);
//   const [lat, setLat] = useState(42.35);
//   const [zoom, setZoom] = useState(9);

//   useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [lng, lat],
//       zoom: zoom
//     });
//   });

//   useEffect(() => {
//     if (!map.current) return; // wait for map to initialize
//     map.current.on('move', () => {
//       setLng(map.current.getCenter().lng.toFixed(4));
//       setLat(map.current.getCenter().lat.toFixed(4));
//       setZoom(map.current.getZoom().toFixed(2));
//     });
//   });

//   return (
//     <div>
//       <div className="sidebar">
//         Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
//       </div>
//     </div>
//   );
// }

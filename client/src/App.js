import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import ReactPlayer from 'react-player';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hlZnlldW0iLCJhIjoiY2wwNDQ2ZjFxMGR4czNxcGRxdDlsODQwdCJ9.j3HMK_j8BvB-EpAMe76wAQ';

const UA_COORDINATES = {
  'latitude': 49.34051271789116,
  'longitude': 31.21759249962616
};

const DUMMY_VIDEO_CLIP_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

const VIDEO_CLIPS = [{
  'latitude': 49.34051271789116,
  'longitude': 31.21759249962616,
  'src': "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/forbiggerescapes.mp4"
},
{
  'latitude': 49.3405,
  'longitude': 31.21759249962616,
  'src': "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/forbiggerescapes.mp4"
},
{
  'latitude': 49.34051271789116,
  'longitude': 31.21759249962616,
  'src': "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/forbiggerescapes.mp4"
}

];


const VideoPreview = ({lat, lon}) => {

  return <Popup longitude={lon} latitude={lat}
    className='p-6 bg-red-500'
    anchor="bottom">
      .
  </Popup>

};

const VideoClipPopup = ({ setShowPopUp, sourceUrl }) => (
  <>
    <Popup longitude={UA_COORDINATES.longitude} latitude={UA_COORDINATES.latitude}
      className={'p-6'}
      anchor="bottom"
      onClose={() => setShowPopUp(false)}>
      <ReactPlayer url={sourceUrl}
        // width='100%' height='auto'
        className={'min-w-96 min-h-96'}
        loop={true}
      />
    </Popup>
  </>
);

export default function App() {
  const [showPopup, setShowPopup] = React.useState(true);

  const [data_ml, setDataML] = React.useState(null);
  const [data_coords, setDataCoords] = React.useState(null);

  // fetch data from /videos_twitter.json
  React.useEffect(() => {
    fetch('/videos_twitter.json')
      .then(response => response.json())
      .then(data => setDataML(data))
      .catch(error => console.log(error));
  }, []);

  // fetch data from /saved_videos.json
  React.useEffect(() => {
    fetch('/saved_cleaned.json')
      .then(response => response.json())
      .then(data => setDataCoords(data.data))
      .catch(error => console.log(error));
  }, []);



  return (
    <>
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
          {/* <VideoClipPopup setShowPopUp={setShowPopup} sourceUrl={DUMMY_VIDEO_CLIP_URL} /> */}
         { data_coords && data_coords.map(item => <VideoPreview key={item.id} lat={item.lat} lon={item.lon} />) }
        </Map>
      </div>
    </>
  );
}
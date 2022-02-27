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


const VideoPreview = ({lat, lon, thumb_url, video_url}) => {

  const [interact, setInteract] = React.useState(false)

  return <Marker longitude={lon} latitude={lat}
    anchor="center"
    >
    {<img className="rounded-full w-24 h-24 object-cover bg-white p-1" src={thumb_url}
      onMouseEnter={() => {
        console.log("mouse enter");
        setInteract(true)
      }} />}
      {interact && <video className="absolute rounded-full w-24 h-24 object-cover bg-white p-1 top-0 left-0" src={video_url} muted={true}
          autoPlay={true}
          loop={true}
        /> }
  </Marker>

};

const VideoClipPopup = ({ setShowPopUp, sourceUrl }) => (
  <>
    <Popup longitude={UA_COORDINATES.longitude} latitude={UA_COORDINATES.latitude}
      style={{ background: '#f00' }}
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
         { data_coords && data_coords.map(item => <VideoPreview key={item.id} lat={item.lat} lon={item.lon}
          video_url={item.url} thumb_url={item.thumbnail_url}/>) }
        </Map>
      </div>
    </>
  );
}
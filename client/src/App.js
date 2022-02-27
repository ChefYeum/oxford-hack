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
      onMouseEnter={() => setInteract(true)} />}
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

// Show a video in fullscreen
const VideoClip = ({id, sourceUrl}) => {
  return <>
    <video className="object-contain pxy-4 absolute m-0 w-auto h-full bg-white p-1 top-0 left-0 mx-auto inset-0 shadow-2xl" src={sourceUrl} muted={true} autoPlay={true} loop={true} />
    <div className='absolute top-0 right-0'>{id}</div>
  </>
}


export default function App() {

  const [showPopup, setShowPopup] = React.useState(true);

  const [data, setData] = React.useState(null);

  const [focus, setFocus] = React.useState(null);

  // fetch data from /videos_twitter.json
  React.useEffect(() => {
    fetch('/videos_twitter_2.json')
      .then(response => response.json())
      .then(data => setData(data.data))
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
          {data && data.map((item, idx) =>
            <div key={item.id} onClick={() => setFocus(idx)}>
             <VideoPreview lat={item.lat} lon={item.lon}
               video_url={item.url} thumb_url={item.thumbnail_url}
                />
           </div>)}
        </Map>
        {focus !== null && <div onClick={() => setFocus(null)}>
          <VideoClip sourceUrl={data[focus].url} id={data[focus].id}/>
          </div>
          }
      </div>
    </>
  );
}
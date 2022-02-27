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


const VideoPreview = ({lat, lon, thumb_url, video_url, emphasize}) => {

  const [interact, setInteract] = React.useState(false)

  const size = emphasize ? 'w-32 h-32' : 'w-12 h-12'; 

  return <Marker longitude={lon} latitude={lat}
    anchor="center"
    >
    {<img className={"transition rounded-full object-cover bg-white p-1 " + size} src={thumb_url}
      onMouseEnter={() => setInteract(true)} />}
      {interact && <video className={"transition absolute rounded-full object-cover bg-white p-1 top-0 left-0 " + size} src={video_url} muted={true}
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
};


const filterFuncs = {
  // car: (data ) => data.detection.car && data.detection.car > 0.5,
  crowded: (data ) => data.detection.person && data.detection.person > 10,
  selfie: (data) => data.detection.person_area && data.detection.person_area > 0.4,
  road: (data) => {
    const undefined_or_0 = (x) => (x === undefined) ? 0 : x;
    const vehicles = [data.detection.car, data.detection["traffic light"], data.detection.bus, data.detection.truck, data.detection.motorcycle];
    // compute the sum
    const sum = vehicles.map(undefined_or_0).reduce((a, b) => a + b);
    return sum > 1.5;
  },
  // inside: (data) => data.detection.chair && data.detection.chair > 0.2 || data.detection.bottle && data.detection.bottle > 0.1 ,
  // dog: data => data.detection.dog && data.detection.dog > 0.1
};

const MLButton = ({filter, setFilter}) => {
  return <div className="absolute bottom-5 right-0">
    {Object.keys(filterFuncs).map(name => <button key={name}
      className={"bg-blue-500 text-white font-bold py-2 px-4 rounded m-3 " + ((name !== filter) ? 'hover:' : '') + 'bg-blue-700'}
      onClick={() => setFilter((name === filter) ? null : name)}>{name}</button>)}
  </div>
};


export default function App() {

  const [filter, setFilter] = React.useState(null);


  const [showPopup, setShowPopup] = React.useState(true);

  const [data, setData] = React.useState(null);

  const [focus, setFocus] = React.useState(null);

  // fetch data from /videos_twitter.json
  React.useEffect(() => {
    fetch('/videos_twitter_2.json')
      .then(response => response.json())
      .then(data => setData(data.data.map((x, idx) => {x.idx = idx; return x})))
      .catch(error => console.log(error));
  }, []);

  const mapper = (item, idx) =>
    <div key={item.id} onClick={() => setFocus(item.idx)}>
      <VideoPreview lat={item.lat} lon={item.lon}
        video_url={item.url} thumb_url={item.thumbnail_url}
        emphasize={filter == null || (filterFuncs[filter] && filterFuncs[filter](item))} />
    </div>;

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
          {data && (filterFuncs[filter] ? 
          [...data.filter(x => !filterFuncs[filter](x)).map(mapper), data.filter(filterFuncs[filter]).map(mapper)] : data.map(mapper))
           }
        </Map>
        {focus !== null && <div onClick={() => setFocus(null)}>
          <VideoClip sourceUrl={data[focus].url} id={data[focus].id}/>
          </div>
          }
      </div>
      <MLButton filter={filter} setFilter={setFilter}/>
    </>
  );
}
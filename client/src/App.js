import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import ReactPlayer from "react-player";
import contract from "./contracts/Payable.json";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2hlZnlldW0iLCJhIjoiY2wwNDQ2ZjFxMGR4czNxcGRxdDlsODQwdCJ9.j3HMK_j8BvB-EpAMe76wAQ";

const UA_COORDINATES = {
  latitude: 49.34051271789116,
  longitude: 31.21759249962616,
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
    {<img className="object-cover w-24 h-24 p-1 bg-white rounded-full" src={thumb_url}
      onMouseEnter={() => setInteract(true)} />}
      {interact && <video className="absolute top-0 left-0 object-cover w-24 h-24 p-1 bg-white rounded-full" src={video_url} muted={true}
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
    <video className="absolute top-0 left-0 w-auto h-full p-1 mx-auto bg-white" src={sourceUrl} muted={true} autoPlay={true} loop={true} />
    <div className='absolute top-0 right-0'>{id}</div>
  </>
}


export default function App() {

  const [showPopup, setShowPopup] = React.useState(true);
  const contractAddress = 0x5fbdb2315678afecb367f032d93f642f64180aa3;
  const abi = contract.abi;

<<<<<<< HEAD
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="px-4 py-2 text-sm font-medium text-white bg-purple-500 border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-75"
      >
        Connect Wallet
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="top-0 justify-between w-full h-16 bg-black opacity-75">
        <div className=""></div>
        <div className="">
          {currentAccount ? "Connected" : connectWalletButton()}
        </div>
      </div>
      <div className="top-0 map-container">
=======
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
>>>>>>> main
        <Map
          initialViewState={{
            latitude: UA_COORDINATES.latitude,
            longitude: UA_COORDINATES.longitude,
<<<<<<< HEAD
            zoom: 5.8,
=======
            zoom: 5.8
>>>>>>> main
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
<<<<<<< HEAD
          <Popup
            longitude={UA_COORDINATES.longitude}
            latitude={UA_COORDINATES.latitude}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
          >
            Video goes here
          </Popup>
        </Map>
      </div>
    </div>
  );
}
=======
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
>>>>>>> main

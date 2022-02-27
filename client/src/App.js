import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import ReactPlayer from "react-player";
import contract from "./contracts/Payable.json";
import { ethers } from "ethers";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2hlZnlldW0iLCJhIjoiY2wwNDQ2ZjFxMGR4czNxcGRxdDlsODQwdCJ9.j3HMK_j8BvB-EpAMe76wAQ";

const UA_COORDINATES = {
  latitude: 49.34051271789116,
  longitude: 31.21759249962616,
};

const DUMMY_VIDEO_CLIP_URL =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

const VIDEO_CLIPS = [
  {
    latitude: 49.34051271789116,
    longitude: 31.21759249962616,
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/forbiggerescapes.mp4",
  },
  {
    latitude: 49.3405,
    longitude: 31.21759249962616,
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/forbiggerescapes.mp4",
  },
  {
    latitude: 49.34051271789116,
    longitude: 31.21759249962616,
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/forbiggerescapes.mp4",
  },
];

const VideoPreview = ({ lat, lon, thumb_url, video_url }) => {
  const [interact, setInteract] = React.useState(false);

  return (
    <Marker longitude={lon} latitude={lat} anchor="center">
      {
        <img
          className="object-cover w-24 h-24 p-1 bg-white rounded-full"
          src={thumb_url}
          onMouseEnter={() => setInteract(true)}
        />
      }
      {interact && (
        <video
          className="absolute top-0 left-0 object-cover w-24 h-24 p-1 bg-white rounded-full"
          src={video_url}
          muted={true}
          autoPlay={true}
          loop={true}
        />
      )}
    </Marker>
  );
};

const VideoClipPopup = ({ setShowPopUp, sourceUrl }) => (
  <>
    <Popup
      longitude={UA_COORDINATES.longitude}
      latitude={UA_COORDINATES.latitude}
      style={{ background: "#f00" }}
      anchor="bottom"
      onClose={() => setShowPopUp(false)}
    >
      <ReactPlayer
        url={sourceUrl}
        // width='100%' height='auto'
        className={"min-w-96 min-h-96"}
        loop={true}
      />
    </Popup>
  </>
);

// Show a video in fullscreen
const VideoClip = ({ id, sourceUrl }) => {
  return (
    <>
      <video
        className="absolute top-0 left-0 w-auto h-full p-1 mx-auto bg-white"
        src={sourceUrl}
        muted={true}
        autoPlay={true}
        loop={true}
      />
      <div className="absolute top-0 right-0">{id}</div>
    </>
  );
};

export default function App() {
  const [showPopup, setShowPopup] = React.useState(true);
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const abi = contract.abi;

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

  const donationButtonHandler = async () => {
    // const { ethereum } = window;
    // ethereum
    //   .request({
    //     method: "eth_sendTransaction",
    //     params: [
    //       {
    //         from: currentAccount,
    //         to: contractAddress,
    //         // value: '0x29a2241af62c0000',
    //         gasPrice: "0x09184e72a000",
    //         gas: "0x2710",
    //       },
    //     ],
    //   })
    //   .then((txHash) => console.log(txHash))
    //   .catch((error) => console.error);
    // currentAccount.send({});
    // const connection = new ethers.providers.JsonRpcProvider();
    // const wallet = connection.getSigner([currentAccount]);
    // const payableContract = new ethers.Contract(contractAddress, abi, provider);
    // const data = await payableContract.getBalance();
    // const gasPrice = connection.getGasPrice();
    // console.log(wallet);
    // const signer = wallet.connect(connection);
    // const tx = {
    //   from: currentAccount.address,
    //   to: contractAddress,
    //   value: ethers.utils.parseUnits("0.01", "ethers"),
    //   gasPrice: gasPrice,
    //   gasLimit: ethers.utils.hexlify(100000),
    //   nonce: connection.getTransactionCount(currentAccount.address, "latest"),
    // };
    // const transaction = await signer.sendTransaction(tx);
    // console.log(transaction);
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="px-4 py-2 text-sm font-medium text-white bg-orange-400 border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-75"
      >
        Connect Wallet
      </button>
    );
  };

  const [usdBalance, setUSDBalance] = useState(0.0);
  const [ethBalance, setETHBalance] = useState(0.0);

  const ethUSDRate = 2850.25;

  const getBalance = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const payableContract = new ethers.Contract(contractAddress, abi, provider);
    console.log("Calling contract");
    const data = await payableContract.getBalance();
    setETHBalance(ethers.utils.formatEther(data));
    setUSDBalance(ethBalance * ethUSDRate);
  };

  useEffect(() => {
    checkWalletIsConnected();
    getBalance();
  }, []);

  const [data, setData] = React.useState(null);

  const [focus, setFocus] = React.useState(null);

  // fetch data from /videos_twitter.json
  React.useEffect(() => {
    fetch("/videos_twitter_2.json")
      .then((response) => response.json())
      .then((data) => setData(data.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="top-0 flex items-center justify-between w-full h-16 px-8 bg-black opacity-75">
        <div className="text-xl text-white">CrowdInfo</div>
        <div className="flex items-center space-x-4 text-white">
          <div>
            Total donated: ${usdBalance} (CRI {ethBalance})
          </div>
          <div>
            {currentAccount ? (
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md cursor-pointer whitespace-nowrap hover:bg-opacity-75"
                onClick={donationButtonHandler}
              >
                Donate
              </button>
            ) : (
              connectWalletButton()
            )}
          </div>
        </div>
      </div>
      <div className="top-0 map-container">
        <Map
          initialViewState={{
            latitude: UA_COORDINATES.latitude,
            longitude: UA_COORDINATES.longitude,
            zoom: 5.8,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {data &&
            data.map((item, idx) => (
              <div key={item.id} onClick={() => setFocus(idx)}>
                <VideoPreview
                  lat={item.lat}
                  lon={item.lon}
                  video_url={item.url}
                  thumb_url={item.thumbnail_url}
                />
              </div>
            ))}
        </Map>
        {focus !== null && (
          <div onClick={() => setFocus(null)}>
            <VideoClip sourceUrl={data[focus].url} id={data[focus].id} />
          </div>
        )}
      </div>
    </div>
  );
}

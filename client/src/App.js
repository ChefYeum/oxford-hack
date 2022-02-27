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

export default function App() {
  const [showPopup, setShowPopup] = React.useState(true);
  const contractAddress = 0x5fbdb2315678afecb367f032d93f642f64180aa3;
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
        <Map
          initialViewState={{
            latitude: UA_COORDINATES.latitude,
            longitude: UA_COORDINATES.longitude,
            zoom: 5.8,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
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

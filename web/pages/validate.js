import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import contract from "../blockchain/compiled_contracts/Payable.json";
import { ethers } from "ethers";

const payoutAddress = "0x102e07b68734f33a097314d08f80e839108ee605";

const UA_COORDINATES = {
  latitude: 49.34051271789116,
  longitude: 31.21759249962616,
};

const VideoPreview = ({ lat, lon, thumb_url, video_url, emphasize }) => {
  const [interact, setInteract] = React.useState(false);

  const size = emphasize ? "w-32 h-32" : "w-12 h-12";

  return (
    <Marker longitude={lon} latitude={lat} anchor="center">
      {
        <img
          className={
            "transition rounded-full object-cover bg-red-300 p-1 " + size
          }
          src={thumb_url}
          onMouseEnter={() => setInteract(true)}
        />
      }
      {interact && (
        <video
          className={
            "transition absolute rounded-full object-cover bg-red-300 p-1 top-0 left-0 " +
            size
          }
          src={video_url}
          muted={true}
          autoPlay={true}
          loop={true}
        />
      )}
    </Marker>
  );
};

const VideoPreviewGray = ({ lat, lon, thumb_url, video_url, emphasize }) => {
  const [interact, setInteract] = React.useState(false);

  const size = "w-16 h-16";

  return (
    <Marker longitude={lon} latitude={lat} anchor="center">
      {
        <img
          className={
            "transition rounded-full object-cover bg-white p-1 grayscale " +
            size
          }
          src={thumb_url}
          // onMouseEnter={() => setInteract(true)}
        />
      }
    </Marker>
  );
};

const filterFuncs = {
  // car: (data ) => data.detection.car && data.detection.car > 0.5,
  crowded: (data) => data.detection.person && data.detection.person > 10,
  selfie: (data) =>
    data.detection.person_area && data.detection.person_area > 0.4,
  road: (data) => {
    const undefined_or_0 = (x) => (x === undefined ? 0 : x);
    const vehicles = [
      data.detection.car,
      data.detection["traffic light"],
      data.detection.bus,
      data.detection.truck,
      data.detection.motorcycle,
    ];
    // compute the sum
    const sum = vehicles.map(undefined_or_0).reduce((a, b) => a + b);
    return sum > 1.5;
  },
  inside: (data) => data.detection.outside < 0.5,
  outside: (data) => data.detection.outside > 0.5,
  // dog: data => data.detection.dog && data.detection.dog > 0.1
};

const MLButton = ({ filter, setFilter }) => {
  return (
    <div className="absolute right-0 bottom-20">
      {Object.keys(filterFuncs).map((name) => (
        <button
          key={name}
          className={
            "bg-blue-500 text-white font-bold py-2 px-4 rounded m-3 " +
            (name !== filter ? "hover:" : "") +
            "bg-blue-700"
          }
          onClick={() => setFilter(name === filter ? null : name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default function App() {
  const [filter, setFilter] = React.useState(null);

  const [showPopup, setShowPopup] = React.useState(true);
  const contractAddress = "0x533Ba064Bf93745f0de41711340eaF335448Cf7d";
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
    const { ethereum } = window;
    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: contractAddress,
            value: ethers.utils.parseEther("1").toHexString(),
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
    // currentAccount.send({});

    // const wallet = connection.getSigner([currentAccount]);
    // const payableContract = new ethers.Contract(contractAddress, abi, provider);
    // const data = await payableContract.getBalance();
    // console.log(wallet);
    // const signer = wallet.connect(connection);
    // const tx = {
    //   from: currentAccount,
    //   to: contractAddress,
    //   value: ethers.utils.parseEther("1").toHexString(),
    // };
    // console.log(tx);
    // const transaction = await provider.send("eth_sendTransaction", tx);
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
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.maticvigil.com"
    );
    const payableContract = new ethers.Contract(contractAddress, abi, provider);
    console.log("Calling contract");
    const data = await payableContract.getBalance();
    const ETHBalance = parseFloat(ethers.utils.formatEther(data));
    setETHBalance(ETHBalance);
    setUSDBalance(ETHBalance * ethUSDRate);
  };

  const payoutUSD = async (amountInUSD) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.maticvigil.com"
    );
    const payableContract = new ethers.Contract(contractAddress, abi, provider);
    const amountInETH = amountInUSD / ethUSDRate;
    const data = await payableContract.interface.encodeFunctionData(
      "transfer(address,uint256)",
      [payoutAddress, ethers.utils.parseEther(amountInETH.toString())]
    );
    const result = await payableContract.interface.decodeFunctionResult(
      "transfer(address,uint256)",
      data
    );

    console.log("payout result", result);
    // .transfer();
  };

  // Show a video in fullscreen
  const VideoClip = ({ id, sourceUrl, payoutInUSD }) => {
    return (
      <div className="absolute inset-0 top-0 left-0 flex flex-col h-full m-0 mx-auto">
        <div className="h-full p-1 mx-auto bg-white">
          <div className="flex items-center justify-between h-10 p-2">
            <div>Payout: ${payoutInUSD}.00</div>
            <div className="space-x-2">
              <button
                onClick={() => payoutUSD(parseInt(payoutInUSD))}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md cursor-pointer whitespace-nowrap hover:bg-opacity-75"
              >
                Approve
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md cursor-pointer whitespace-nowrap hover:bg-opacity-75">
                Reject
              </button>
            </div>
          </div>
          <video
            className="object-contain w-auto h-full mx-auto shadow-2xl "
            src={sourceUrl}
            muted={true}
            autoPlay={true}
            loop={true}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
    getBalance();
  }, []);

  const [dataGray, setDataGray] = React.useState(null);
  const [data, setData] = React.useState(null);

  const [focus, setFocus] = React.useState(null);

  const banned = {
    1497669073374785500: true,
    1497668417263911000: true,
    1497718237026525200: true,
    1497716296250712000: true,
    1497714870149652500: true,
    1497713280365781000: true,
    1497711970677633000: true,
    1497709969151611000: true,
    1497708774894747600: true,
    1497704805095067600: true,
    1497695642445140000: true,
    1497695392439410700: true,
    1497694227215667200: true,
    1497691574058299400: true,
    1497690773692821500: true,
    1497687738774171600: true,
    1497685436952686600: true,
    1497684838681305000: true,
    1497683269181128700: true,
    1497681261535522800: true,
    1497680188167106600: true,
    1497673896002261000: true,
    1497679038604849200: true,
    1492718201184178200: true,
    1497671120778145800: true,
    1497670652026933200: true,
    1497669861845123000: true,
    1497669346025427000: true,
    1497664719724892200: true,
    1497663665981608000: true,
    1497271890058039300: true,
    1487769788696957000: true,
    1487384892677709800: true,
    1495112011415498800: true,
    1487808026811768800: true,
    1497634273012199400: true,
    1489742980864954400: true,
    1493270784059576300: true,
    149766366598160800: true,
    1497110770617925600: true,
  };

  // fetch data from /videos_twitter.json
  React.useEffect(() => {
    fetch("/videos_twitter_2.json")
      .then((response) => response.json())
      .then((data) =>
        setDataGray(
          data.data
            .filter(
              (x) =>
                !(x.id in banned) && x.lon != 22.13572 && x.lat != 44.386383
            )
            .map((x, idx) => {
              x.idx = idx;
              return x;
            })
        )
      )
      .catch((error) => console.log(error));

    fetch("/to_validate.json")
      .then((response) => response.json())
      .then((data) => {
        setData(
          data.data.map((x, idx) => {
            x.idx = idx;
            return x;
          })
        );
      })
      .catch((error) => console.log(error));
  }, []);

  const mapperGray = (item, idx) => (
    <div key={item.id}>
      <VideoPreviewGray
        lat={item.lat}
        lon={item.lon}
        video_url={item.url}
        thumb_url={item.thumbnail_url}
        emphasize={
          filter == null || (filterFuncs[filter] && filterFuncs[filter](item))
        }
      />
    </div>
  );

  const mapper = (item, idx) => (
    <div key={item.id} onClick={() => setFocus(item.idx)}>
      <VideoPreview
        lat={item.lat}
        lon={item.lon}
        video_url={item.url}
        thumb_url={item.thumbnail_url}
        emphasize={
          filter == null || (filterFuncs[filter] && filterFuncs[filter](item))
        }
      />
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="top-0 flex items-center justify-between w-full h-16 px-4 bg-black opacity-75 md:px-8">
        <div className="text-xl text-white">CrowdInfo Validation View</div>
        <div className="flex items-center pl-4 space-x-4 text-sm text-white md:text-base">
          <div>
            Total to pay out: ${usdBalance * 0.812} (CRI {ethBalance * 0.812})
          </div>
          <div>
            {currentAccount ? (
              // <button
              //   className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md cursor-pointer whitespace-nowrap hover:bg-opacity-75"
              //   onClick={donationButtonHandler}
              // >
              //   Incentivise
              // </button>
              <></>
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
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          {dataGray && dataGray.map(mapperGray)}
          {data && data.map(mapper)}
        </Map>
        {focus !== null && (
          <div onClick={() => setFocus(null)}>
            <VideoClip
              sourceUrl={data[focus].url}
              id={data[focus].id}
              payoutInUSD={data[focus].payoutInUSD}
            />
          </div>
        )}
      </div>
      {/* <MLButton filter={filter} setFilter={setFilter} /> */}
    </div>
  );
}

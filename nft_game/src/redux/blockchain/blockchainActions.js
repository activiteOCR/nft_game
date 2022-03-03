// constants
import Web3 from "web3";
import bbbearsToken from "../../contracts/bbbearsToken.json";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      //window.ethereum.enable(); //added this line 03/01/2022 to reconnect the account of my metamask wallet
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        console.log("account:",accounts);
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        console.log("network:",networkId);
        const bbbearsTokenNetworkData = await bbbearsToken.networks[networkId];
        console.log("network:",bbbearsTokenNetworkData);
        if (bbbearsTokenNetworkData) {
          const bbbearstoken = new web3.eth.Contract(
            bbbearsToken.abi,
            bbbearsTokenNetworkData.address
          );
        /*
        if (networkId === 137) {
          const bbbearstoken = new web3.eth.Contract(
            bbbearsToken.abi,
            "0xb2643Da70AA26E5F03CA9742Bcd696636759f47A"
          );*/
          dispatch(
            connectSuccess({
              account: accounts[0],
              bbbearsToken: bbbearstoken,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Polygon."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};

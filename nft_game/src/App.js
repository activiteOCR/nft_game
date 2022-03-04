import React, { useEffect, useState } from "react";
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  console.log(data);

  const mintNFT = (_account, _name) => {
    //setLoading(true);
    blockchain.bbbearsToken.methods
      .createRandomBBBears(_name)
      .send({
        from: _account,
        value: 1000000000000000000
        //value: blockchain.web3.utils.toWei("0.01", "ether"),
      })
      .once("error", (err) => {
        //setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        //setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
      });
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.bbbearsToken !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.bbbearsToken]);

  return (
    <s.Screen >
      {blockchain.account === "" || blockchain.bbbearsToken === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the game</s.TextTitle>
          <s.SpacerSmall />
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </button>
          <s.SpacerXSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container ai={"center"} style={{ padding: "24px" }}>
          <s.TextTitle>Welcome to the game</s.TextTitle>
          <s.SpacerSmall />
          <button
            //disabled={loading ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFT(blockchain.account, "Unknown");
            }}
          >
            CREATE NFT LIP
          </button>
          <s.SpacerMedium />
          <s.Container jc={"space-between"} fd={"row"} style={{ flexWrap: "wrap" }}>
            {data.allbbbears.map((item) => {
              return (
                <>
                  <s.Container>
                    <s.TextDescription>ID: {item.id}</s.TextDescription>
                    <s.TextDescription>DNA: {item.dna}</s.TextDescription>
                    <s.TextDescription>LEVEL: {item.level}</s.TextDescription>
                    <s.TextDescription>NAME: {item.name}</s.TextDescription>
                    <s.TextDescription>RARITY: {item.rarity}</s.TextDescription>
                  </s.Container>
                  <s.SpacerMedium />
                  </>
              );
            })}
            </s.Container>
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;

// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let allbbbears = await store
        .getState()
        .blockchain.bbbearsToken.methods.getBBBears()
        .call();
      let allOwnerbbbears = await store
        .getState()
        .blockchain.bbbearsToken.methods.getOwnerBBBears(account)
        .call();

      dispatch(
        fetchDataSuccess({
          allbbbears,
          allOwnerbbbears,
        })
      );
    } catch (err) {
      //console.log(err); // comment this due to TypeError: Cannot read properties of undefined (reading 'methods')
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

import * as actionTypes from "../actions/actionTypes";

const initialState = {
  2020: {
    W01: {
      name: "Sprint 01",
      members: ["grattanj", "dbest"],
    },
  },
  2021: {
    W01: {},
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;

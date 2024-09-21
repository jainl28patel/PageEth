import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BackendClient from '../BackendClient';
import { avail, sign, ens } from '../urls';

const tabsData = [
  { name: 'Jainil', ens: 'jainil.eth', hash: '0xed47bd991A6767d090365DBeD6DA3d9496473cEE', hashVis: false, doMessage: false },
  { name: 'Alice', ens: 'alice.eth', hash: '0xed47bd991A6767d090365DBeD6DA3d9496473cEA', hashVis: false, doMessage: false },
  { name: 'Bob', ens: 'bob.eth', hash: '0xed47bd991A6767d090365DBeD6DA3d9496473cEB', hashVis: false, doMessage: false },
  { name: 'Sumit', ens: 'victorygod.eth', hash: '', hashVis: false, doMessage: false },
];

const initialState = {
  userName: 'Subhajit',
  activeTab: 'Dashboard',
  tabs: tabsData,
  messageBox: false,
  messagers: [],
  nextUid: 6,
  textMessages: [
    // {
    //   "uid": 1,
    //   "msg": "Hello!",
    //   "step": 1,
    // },
    // {
    //   "uid": 2,
    //   "msg": "How are You?",
    //   "step": 1,
    // },
    // {
    //   "uid": 3,
    //   "msg": "I'm good, thanks!",
    //   "step": 1,
    // },
    // {
    //   "uid": 4,
    //   "msg": "What about you?",
    //   "step": 1,
    // },
    // {
    //   "uid": 5,
    //   "msg": "I'm doing well!",
    //   "step": 1,
    // }
  ],
  status: 'idle',
  error: null,
};

// Async thunk for sending a message
export const sendMessageToBlockChain = createAsyncThunk(
  'home/sendMessageToBlockChain',
  async (message, { getState, dispatch, rejectWithValue }) => {
    try {
      const messageRaw = message.msg;
      const uid = message.uid;
      const messageData = {
        "data": messageRaw,
      };
      console.log("----- DATA : ", messageData);
      const state = getState().home;

      // First request to avail endpoint
      const response = await BackendClient.post(`${avail()}`, messageData);
      console.log("Avail Data", response.data);

      // Increment step after first request
      dispatch(incrementMessageStep(uid));

      const key = "0x36EFD59Ca684B113DC28144DB243aB3e4685921c";
      const to_address = state.messagers.map((messager) => messager.hash);
      const txHash = response.data.txHash;
      const blockHash = response.data.blockHash;
      const concatStr = `${txHash}_${blockHash}`;

      const msg_to_sign = {
        "from": key,
        "to": ['0xed47bd991A6767d090365DBeD6DA3d9496473cEE'],
        "data": concatStr,
        "isctrlmsg": false,
      };

      // Second request to sign endpoint
      console.log("Going to Sign", msg_to_sign);
      const sign_response = await BackendClient.post(`${sign()}`, msg_to_sign);
      console.log("Sign Data", sign_response.data);

      // Increment step after second request
      dispatch(incrementMessageStep(uid));

      // const sign_hash = sign_response.data.attestationId;
      // const new_msg = `${concatStr}_${sign_hash}`;

      // const finalData = {
      //   "message": new_msg,
      // };

      // Third request to layer0 endpoint
      // console.log("Going to Layer0: ", finalData);
      // const finalResponse = await BackendClient.post(`${layer0()}`, finalData);
      // console.log("Layer0 Data", finalResponse.data);

      // // Increment step after third request (final step)
      // dispatch(incrementMessageStep(uid));

      return sign_response.data;

    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Async thunk for retrieving ENS hash
export const retrieveEns = createAsyncThunk(
  'home/retrieveEns',
  async (ensName, { getState, rejectWithValue }) => {
    try {
      // Access the current state
      const state = getState().home;

      // Find the tab index based on the ensName
      const tabIndex = state.tabs.findIndex((tab) => tab.ens === ensName);
      console.log("MessagerIndex",tabIndex);
      
      if (tabIndex === -1) {
        throw new Error(`Tab with ENS name ${ensName} not found`);
      }
      // Call backend to retrieve hash using ENS
      const response = await BackendClient.post(`${ens()}`, { ensname: ensName } );

      // Return the retrieved hash and the index of the tab
      return { hash: response.data.value, index: tabIndex };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addTab: (state, action) => {
      state.tabs.push(action.payload);
    },
    updateTab: (state, action) => {
      const { index, updatedTab } = action.payload;
      state.tabs[index] = { ...state.tabs[index], ...updatedTab };
    },
    toggleMessageBox: (state) => {
      state.messageBox = !state.messageBox;
    },
    toggleDoMessage: (state, action) => {
      const { index, doMessage } = action.payload;
      state.tabs[index].doMessage = doMessage;

      const user = {
        name: state.tabs[index].name,
        hash: state.tabs[index].hash,
      };

      if (doMessage) {
        const exists = state.messagers.find((messager) => messager.name === user.name);
        if (!exists) {
          state.messagers.push(user);
        }
      } else {
        state.messagers = state.messagers.filter((messager) => messager.name !== user.name);
      }
    },
    toggleHashVisibility: (state, action) => {
      const { index, hashVis } = action.payload;
      state.tabs[index].hashVis = hashVis;
    },
    addMessage: (state, action) => {
      const msgObj = {
        uid: state.nextUid,
        msg: action.payload,
        step: 1,
      };
      state.textMessages.push(msgObj);
      state.nextUid += 1;
    },
    // New reducer to increment the step of a specific message by uid
    incrementMessageStep: (state, action) => {
      const uid = action.payload;
      const message = state.textMessages.find((msg) => msg.uid === uid);
      if (message) {
        message.step += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending state
      .addCase(sendMessageToBlockChain.pending, (state) => {
        state.status = 'loading';
      })
      // Fulfilled state
      .addCase(sendMessageToBlockChain.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("Final Data", action.payload);
      })
      // Rejected state
      .addCase(sendMessageToBlockChain.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Pending state
      .addCase(retrieveEns.pending, (state) => {
        state.status = 'loading';
      })
      // Fulfilled state
      .addCase(retrieveEns.fulfilled, (state, action) => {
        const { hash, index } = action.payload;
        state.status = 'succeeded';
        state.tabs[index].hash = hash;
      })
      // Rejected state
      .addCase(retrieveEns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { 
  setUserName, 
  setActiveTab, 
  addTab, 
  updateTab, 
  toggleMessageBox, 
  toggleDoMessage, 
  toggleHashVisibility, 
  addMessage, 
  incrementMessageStep 
} = homeSlice.actions;

export default homeSlice.reducer;

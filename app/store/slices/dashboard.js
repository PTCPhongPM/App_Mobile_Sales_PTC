import { createSlice } from "@reduxjs/toolkit";
import { colors } from "../../configs/themes";

const approvalId = "OthersStack/Approval";
const activeArr = [
  {
    id: approvalId,
    text: "Phê duyệt",
    color: colors.primary900,
  },
  {
    //todo
    id: "OthersStack/Inventory",
    text: "Tồn kho",
    color: colors.stateOrangeDefault,
  },
  {
    id: "OthersStack/DeliverySchedule",
    text: "Lịch giao xe",
    color: colors.stateGreenDefault,
  },
  {
    id: "OthersStack/TestDriveManagement",
    text: "Lái thử",
    color: colors.stateBlueDefault,
  },
  {
    id: "Contracts",
    text: "Hợp đồng",
    color: colors.stateOrangeDefault,
  },
  {
    id: "Customers",
    text: "Tiềm năng",
    color: colors.stateRedDefault,
  },
  {
    id: "OthersStack/FromCompanyCustomers",
    text: "KH công ty",
    color: colors.stateBlueDefault,
  },
  {
    id: "AllocationProduct",
    text: "DS phân xe",
    color: colors.stateOrangeDefault,
  },
];

const expansionArr = [
  {
    id: "TaskManagement",
    text: "Công việc",
    color: colors.stateRedDefault,
  },
  {
    id: "OthersStack/FrozenCustomers",
    text: "Đóng băng",
    color: colors.stateBlueDark,
  },
  {
    id: "OthersStack/LostCustomers",
    text: "KH mất",
    color: colors.primary900,
  },
  {
    id: "OthersStack/BoughtCustomers",
    text: "KH đã mua",
    color: colors.stateGreenDefault,
  },
];

const initialState = {
  activeArr,
  expansionArr,
  isDirector: false,
  approvalInfo: {
    index: 0,
    in: "activeArr",
  },
};

const slice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveArr: (state, { payload }) => {
      state.activeArr = payload;
    },
    setExpansionArr: (state, { payload }) => {
      state.expansionArr = payload;
    },
    transportItem: (state, { payload }) => {
      const { from, index, to } = payload;

      // get item by index
      const item = state[from][index];

      // remove item from old array
      state[from].splice(index, 1);

      // add to new array
      state[to].push(item);
    },
    removeApprove: (state) => {
      let index = state.activeArr.findIndex((e) => e.id === approvalId);

      if (index > -1) {
        state.activeArr.splice(index, 1);
        state.approvalInfo = {
          index,
          in: "activeArr",
        };
        return;
      }

      index = state.expansionArr.findIndex((e) => e.id === approvalId);
      if (index > -1) {
        state.expansionArr.splice(index, 1);
        state.approvalInfo = {
          index,
          in: "expansionArr",
        };
      }
    },
    addApprove: (state) => {
      let index = state.activeArr.findIndex((e) => e.id === approvalId);
      if (index > -1) return;
      index = state.expansionArr.findIndex((e) => e.id === approvalId);
      if (index > -1) return;

      if (state.approvalInfo.in === "activeArr") {
        state.activeArr.splice(state.approvalInfo.index, 0, {
          id: "OthersStack/Approval",
          text: "Phê duyệt",
          color: colors.primary900,
        });

        return;
      }

      if (state.approvalInfo.in === "expansionArr") {
        state.expansionArr.splice(state.approvalInfo.index, 0, {
          id: "OthersStack/Approval",
          text: "Phê duyệt",
          color: colors.primary900,
        });
      }
    },
  },
});

export const {
  setActiveArr,
  setExpansionArr,
  transportItem,
  removeApprove,
  addApprove,
} = slice.actions;

export const getDashboardArrays = (state) => state.dashboard;

export default slice.reducer;

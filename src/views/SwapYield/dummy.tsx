import { OrderState, SwapState } from "./types";


export const PartyOrderData=[
    {
        id:0,
        uamount:10,
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    },
    {
        id:1,
        uamount:10,
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    },
    {
        id:2,
        uamount:10,
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    },
    {
        id:3,
        uamount:10,
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    }
]

export const CPartySwapData = [
    {
        id:0,
        yamount: 20,
        damount: 30,
        leftTime: 1649789236, // timestamp
        state:SwapState.All
    },
    {
        id:1,
        yamount: 20,
        damount: 30,
        leftTime: 1649789236, // timestamp
        state:SwapState.Applied
    },
    {
        id:2,
        yamount: 20,
        damount: 30,
        leftTime: 1649789236, // timestamp
        state:SwapState.Processing
    },
    {
        id:3,
        yamount: 20,
        damount: 30,
        leftTime: 1649789236, // timestamp
        state:SwapState.Finished
    },
    {
        id:4,
        yamount: 20,
        damount: 30,
        leftTime: 1649789236, // timestamp
        state:SwapState.Earned
    }
]

export const CandidateData=[
    {
        id:0,
        address:"0x3423",
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    },
    {
        id:1,
        address:"0x3423",
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    },
    {
        id:2,
        address:"0x3423",
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    },
    {
        id:3,
        address:"0x3423",
        yamount: 20,
        dueTimeStamp: 1649789236, // timestamp
        state:OrderState.Active
    }
]
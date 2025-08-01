import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const TransferContext = createContext() ;

export const TransferProvider = ({children})=>{
    const {currentUser} = useAuth() ;
    const [transfers,setTransfers] = useState([]) ;

    const TRANSFER_URL = import.meta.env.VITE_TRANSFERS_URL ;

    const fetchTransfers = async ()=>{
        const res = await axios.get(TRANSFER_URL) ;
        setTransfers(res.data) ;
    };

    const addTransfer = async(newTransfer)=>{
        const record ={
            ...newTransfer ,
            date:new Date().toISOString(),
        };

        await axios.post(TRANSFER_URL,record) ;
        setTransfers([...transfers , record]) ;
    };

    const getTransfersByUser = (accountNumber)=>{
        return transfers.filter((t)=> t.from === accountNumber || t.to === accountNumber)
        .map((t)=>({
            ...t ,
            status : t.from === accountNumber ? "Sent":"Received",
        }));
    };

    useEffect(()=>{
        if(currentUser){
        fetchTransfers() ;
        }
    },[currentUser]);

    return(
        <TransferContext.Provider value={{transfers,addTransfer,getTransfersByUser}}>
            {children}
        </TransferContext.Provider>
    );
};

export const useTransfers = ()=> useContext(TransferContext);
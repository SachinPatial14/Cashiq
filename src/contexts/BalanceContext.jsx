import React, { createContext, useContext, useEffect, useState } from "react";
import { useExpenses } from "./ExpensesContext";
import { useIncomes } from "./IncomeContext";
import { useTransfers } from "./TransferContext";
import { useAuth } from "./AuthContext";

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
    const { totalExpense } = useExpenses();
    const { totalIncome } = useIncomes();
    const [balance, setBalance] = useState(0);
    const {transfers} = useTransfers() ;
    const {currentUser} = useAuth() ;

    const calculateTransferAdjustments = ()=>{
         if (!currentUser) return 0;

        const sent = transfers.filter((t)=> t.from === currentUser.accountNumber)
        .reduce((sum,t)=> sum + Number(t.amount),0);
        const received = transfers.filter((t)=> t.to === currentUser.accountNumber)
        .reduce((sum,t)=> sum + Number(t.amount),0);
        return received - sent ;
    };

    useEffect(()=>{
         if (!currentUser) return ;
         
        const transferDelta = calculateTransferAdjustments() ;
        const newBalance = totalIncome - totalExpense + transferDelta ;
        setBalance(newBalance) ;
    },[totalExpense,totalIncome,transfers,currentUser]);



    return (
        <BalanceContext.Provider value={{ balance }}>
            {children}
        </BalanceContext.Provider>
    )
}

export const useBalance = () => useContext(BalanceContext);
import React, { createContext, useContext, useEffect, useState } from "react";
import { useExpenses } from "./ExpensesContext";
import { useIncomes } from "./IncomeContext";
import { useTransfers } from "./TransferContext";
import { useAuth } from "./AuthContext";
import { useLoans } from "./LoanContext";

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
    const { totalExpense } = useExpenses();
    const { totalIncome } = useIncomes();
    const [balance, setBalance] = useState(0);
    const {transfers} = useTransfers() ;
    const {currentUser} = useAuth() ;
    const {loans} = useLoans() ;

    const calculateTransferAdjustments = ()=>{
         if (!currentUser) return 0;

        const sent = transfers.filter((t)=> String(t.from) === String(currentUser.accountNumber))
        .reduce((sum,t)=> sum + Number(t.amount),0);
        const received = transfers.filter((t)=> String(t.to) === String(currentUser.accountNumber))
        .reduce((sum,t)=> sum + Number(t.amount),0);
        return received - sent ;
    };

    useEffect(()=>{
         if (!currentUser) return ;
         
        const transferDelta = calculateTransferAdjustments() ;
        const totalLoanAmount = loans.reduce((sum,loan)=> sum + Number(loan.amount || 0),0)
        const newBalance = totalIncome - totalExpense + transferDelta + totalLoanAmount ;
        setBalance(newBalance) ;
    },[totalExpense,totalIncome,transfers,currentUser,loans]);



    return (
        <BalanceContext.Provider value={{ balance }}>
            {children}
        </BalanceContext.Provider>
    )
}

export const useBalance = () => useContext(BalanceContext);
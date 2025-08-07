import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const LoanContext = createContext() ;

export const LoanProvider = ({children})=>{
    const [loans,setLoans] = useState([]);
    const [recentEMI, setRecentEMI] = useState([]);
    const {currentUser} = useAuth();
    const loanURL = import.meta.env.VITE_LOAN_URL ;
    const emiURL = import.meta.env.VITE_EMI_URL ;

    const fetchLoans = async()=>{
       if(!currentUser) return ;

       try{
         const response = await axios.get(`${loanURL}?userId=${currentUser?.id}`)
         setLoans(response.data || []);
       }catch(err){
         console.error("Error fetching loans",err);
       }
    };
     const fetchEmiTransactions = async () => {
      if (!currentUser?.id) return;

      try {
        const res = await axios.get(`${emiURL}?userId=${currentUser.id}`);
        let emis = res.data || [];

        emis.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));

        setRecentEMI(emis);
      } catch (err) {
        console.error("Failed to fetch EMI transactions", err);
      }
    };

    useEffect(()=>{
      fetchEmiTransactions();
    },[currentUser])


    useEffect(()=>{
        fetchLoans();
    },[currentUser]);

    const getLoanType =(loanId)=>{
      const loan = loans.find((l)=> l.id === loanId);
      return loan?loan.loantype : loanId ;
    };

    return(
        <LoanContext.Provider value={{loans , fetchLoans,getLoanType,recentEMI,fetchEmiTransactions}}>
          {children}
        </LoanContext.Provider>
    )
};

export const useLoans =()=> useContext(LoanContext) ;
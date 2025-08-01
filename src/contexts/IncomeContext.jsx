import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { endOfMonth, isAfter, isWithinInterval, parseISO, startOfMonth, subDays, subMonths } from "date-fns";

export const IncomeContext = createContext() ;

export const IncomeProvider = ({children})=>{
    const [incomes,setIncomes] = useState([]) ;
    const [totalIncome,setTotalIncomes] = useState(0);
    const incomeURL = import.meta.env.VITE_INCOMES_URL ;
    const {currentUser} = useAuth() ;
    const [editIncome,setEditIncome] = useState(null) ;

    const thirtyDaysAgo = subDays(new Date(),30) ;
    const lastMonthStart = startOfMonth(subMonths(new Date(),1)) ;
    const lastMonthEnd = endOfMonth(subMonths(new Date(),1));

    const last30DaysIncome = incomes.filter(item=> isAfter(parseISO(item.date),thirtyDaysAgo)).
    reduce((acc,curr)=> acc + curr.amount ,0);

    const lastMonthIncomes = incomes.filter(item=> isWithinInterval(parseISO(item.date),{
        start : lastMonthStart ,
        end : lastMonthEnd ,
    })).reduce((acc,curr)=> acc + curr.amount,0);

    const fetchIncomes = async()=>{
        try{
            const res = await axios.get(incomeURL) ;
            const filterIncomes = res.data.filter((inc)=> inc.userId === currentUser?.id) ;
            setIncomes(filterIncomes) ;
        }catch(err){
            console.err("fetching failed expenses",err) ;
        } 
    } ;

    useEffect(()=>{
        if(currentUser?.id){
            fetchIncomes() ;
        }else{
            setIncomes([]) ;
        }
    },[currentUser]) ;

    useEffect(()=>{
        const total = incomes.reduce((acc,curr)=> acc + parseFloat(curr.amount || 0),0);
        setTotalIncomes(total);
    },[incomes]) ;

    const addIncome = (newIncome)=>{
        setIncomes((prev)=> [...prev,newIncome]) ;
    } ;

    const removeIncome = async(id)=>{
        try{
         await axios.delete(`${incomeURL}/${id}`) ;
         setIncomes((prev)=> prev.filter((inc)=> inc.id !== id)) ;
        }catch(err){
            console.error("failed to delete expense",err);
        }
    } ;

    const handleEdit=(inc)=>{
        setEditIncome(inc) ;
    } ;

    const updateIncome = (updatedIncome)=>{
       setIncomes((prev)=>
    prev.map((inc)=> (inc.id === updatedIncome.id?updatedIncome:inc))) ;
    } ;

    return(
        <IncomeContext.Provider value={{incomes,lastMonthIncomes,last30DaysIncome,totalIncome,addIncome,removeIncome,handleEdit,editIncome,setEditIncome,updateIncome}}>
         {children}
        </IncomeContext.Provider>
    )
} ;

export const useIncomes = ()=> useContext(IncomeContext) ;
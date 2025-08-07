import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { endOfMonth, isAfter, isWithinInterval, parseISO, startOfMonth, subDays, subMonths } from "date-fns";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [totalExpense,setTotalExpense] = useState(0) ;
    const expenseURL = import.meta.env.VITE_EXPENSES_URL;
    const {currentUser} = useAuth() ;
    const [editExpense,setEditExpense] = useState(null) ;

    const thirtyDaysAgo = subDays(new Date(),30) ;
    const lastMonthStart = startOfMonth(subMonths(new Date(),1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(),1));

    const last30DaysExpenses = expenses.filter(item => isAfter(parseISO(item.date),thirtyDaysAgo)).
    reduce((acc,curr)=> acc + parseFloat(curr.amount || 0),0) ;

    const lastMonthExpenses = expenses.filter(item=> isWithinInterval(parseISO(item.date),{
      start : lastMonthStart ,
      end : lastMonthEnd ,
    })).reduce((acc,curr)=> acc + parseFloat(curr.amount || 0) ,0) ;


     const fetchExpenses = async () => {
            try {
                const res = await axios.get(expenseURL);
                const filterExpenses = res.data.filter((exp) => exp.userId === currentUser?.id);
                setExpenses(filterExpenses);
            } catch (err) {
                console.error("fetching failed expenses", err)
            }
        };


    useEffect(() => {
         if (currentUser?.id) {
      fetchExpenses();
    } else {
      setExpenses([]); 
    }
    }, [currentUser]);

    useEffect(()=>{
      const total = expenses.reduce((acc,curr)=> acc + parseFloat(curr.amount || 0),0) ;
      setTotalExpense(total) ;
    },[expenses]);

     const addExpense = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  const removeExpense = async(id) =>{
    try{
     await axios.delete(`${expenseURL}/${id}`) ;
     setExpenses((prev)=> prev.filter((exp)=> exp.id !== id) ) ;
    }catch(err){
        console.error("failed to delete expense",err)
    }
  }

  const handleEdit = (exp)=>{
    setEditExpense(exp) ;
  } ;

  const updateExpense = (updatedExpense) => {
  setExpenses((prev) =>
    prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
  );
};

    return (
        <ExpenseContext.Provider value={{expenses,last30DaysExpenses,lastMonthExpenses,totalExpense,addExpense,removeExpense,handleEdit,editExpense,setEditExpense,updateExpense}}>
            {children}
        </ExpenseContext.Provider>
    )
};

export const useExpenses = () => useContext(ExpenseContext);
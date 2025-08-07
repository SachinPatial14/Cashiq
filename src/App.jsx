import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard';
import Account from './pages/Account';
import Currency from './pages/Currency';
import ExpensesList from './pages/ExpensesLists';
import ExpenseForm from './pages/ExpenseForm';
import ExpenseSummary from './pages/ExpenseSummary';
import IncomeList from './pages/IncomeList';
import IncomeForm from './pages/IncomeForm';
import IncomeSummary from './pages/IncomeSummary';
import BeneficialAccount from './pages/BeneficialAccount';
import LoanManager from './pages/LoanManager';
import LoanForm from './pages/LoanForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<SignUp />} />
        <Route path='/home' element={<ProtectedRoute>
          <Layout />
        </ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="account" element={<Account />} />
          <Route path='currency' element={<Currency />} />
          <Route path='expenseslist' element={<ExpensesList />} />
          <Route path='expenseform' element={<ExpenseForm />} />
          <Route path='expensesummary' element={<ExpenseSummary />} />
          <Route path='incomelist' element={<IncomeList />} />
          <Route path='incomeform' element={<IncomeForm />} />
          <Route path='incomesummary' element={<IncomeSummary />} />
          <Route path='beneficialaccount' element={<BeneficialAccount />} />
          <Route path='loanmanager' element={<LoanManager />} />
          <Route path='loanform' element={<LoanForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

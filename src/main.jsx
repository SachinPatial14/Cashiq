import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import CurrencyProvider from './contexts/CurrencyContext.jsx';
import { ExpenseProvider } from './contexts/ExpensesContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { IncomeProvider } from './contexts/IncomeContext.jsx';
import { BalanceProvider } from './contexts/BalanceContext.jsx';
import { TransferProvider } from './contexts/TransferContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TransferProvider>
        <ExpenseProvider>
          <IncomeProvider>
            <BalanceProvider>
              <CurrencyProvider>
                <App />
              </CurrencyProvider>
            </BalanceProvider>
          </IncomeProvider>
        </ExpenseProvider>
      </TransferProvider>
    </AuthProvider>
  </StrictMode>
)

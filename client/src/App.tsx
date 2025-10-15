import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import { SideNav } from "./Sidenav";
import { InventoryRecordForm } from "./InventoryRecordForm";
import WorkSchedule from "./WorkSchedule";
import { InventoryRecordProvider } from "./contexts/inventory-record-context";
function App() {
  return (
    <Router>
      <div className="app-container">
        <SideNav/>
        <InventoryRecordProvider>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
               
                  <FinancialRecordsProvider>
                    {/* <Dashboard /> */}
                    <InventoryRecordForm/>
                  </FinancialRecordsProvider>
                </SignedIn>

                <SignedOut>
             
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route path='/schedule' element={<WorkSchedule/>}/>
          <Route path='/products' element={<InventoryRecordForm/>}/>
        </Routes>
        </InventoryRecordProvider>
      </div>
      
    </Router>
  );
}

export default App;

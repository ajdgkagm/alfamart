import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Router, { children: _jsxs("div", { className: "app-container", children: [_jsx(SideNav, {}), _jsx(InventoryRecordProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsxs(_Fragment, { children: [_jsx(SignedIn, { children: _jsx(FinancialRecordsProvider, { children: _jsx(InventoryRecordForm, {}) }) }), _jsx(SignedOut, { children: _jsx(RedirectToSignIn, {}) })] }) }), _jsx(Route, { path: "/auth", element: _jsx(Auth, {}) }), _jsx(Route, { path: '/schedule', element: _jsx(WorkSchedule, {}) }), _jsx(Route, { path: '/products', element: _jsx(InventoryRecordForm, {}) })] }) })] }) }));
}
export default App;

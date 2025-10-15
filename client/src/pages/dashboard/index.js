import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUser } from '@clerk/clerk-react';
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import './financial-record.css';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { useMemo } from 'react';
export const Dashboard = () => {
    const { user } = useUser();
    const { records } = useFinancialRecords();
    const totalMonthly = useMemo(() => {
        let totalAmount = 0;
        records.forEach((record) => {
            totalAmount += record.amount;
        });
        return totalAmount;
    }, [records]);
    return _jsxs("div", { className: "dashboard-container", children: [" ", _jsx(FinancialRecordForm, {}), _jsxs("div", { children: [" Total Monthly: ", totalMonthly] }), _jsx(FinancialRecordList, {})] });
};

import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
const InventoryRecordContext = createContext(undefined);
export const InventoryRecordProvider = ({ children }) => {
    const [inventoryRecords, setInventoryRecords] = useState([]);
    const { user } = useUser();
    // ✅ Centralized fetch function
    const refreshRecords = async () => {
        if (!user?.id)
            return;
        try {
            const res = await axios.get(`http://localhost:3001/inventory-records/getAllByUserID/${user.id}`);
            setInventoryRecords(res.data);
        }
        catch (err) {
            console.error("Error fetching inventory records:", err);
        }
    };
    useEffect(() => {
        refreshRecords();
    }, [user?.id]);
    // ✅ Add record + refresh
    const addRecord = async (record) => {
        try {
            await axios.post("http://localhost:3001/inventory-records/create", record);
            await refreshRecords(); // ⬅ refresh instantly
        }
        catch (err) {
            console.error("Error adding record:", err);
        }
    };
    // ✅ Update record + refresh
    const updateRecord = async (id, updated) => {
        try {
            await axios.put(`http://localhost:3001/inventory-records/update/${id}`, updated);
            await refreshRecords(); // ⬅ refresh instantly
        }
        catch (err) {
            console.error("Error updating record:", err);
        }
    };
    // ✅ Delete record + refresh
    const deleteRecord = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/inventory-records/delete/${id}`);
            await refreshRecords(); // ⬅ refresh instantly
        }
        catch (err) {
            console.error("Error deleting record:", err);
        }
    };
    return (_jsx(InventoryRecordContext.Provider, { value: { inventoryRecords, addRecord, updateRecord, deleteRecord, refreshRecords }, children: children }));
};
export const useInventoryRecords = () => {
    const context = useContext(InventoryRecordContext);
    if (!context) {
        throw new Error("useInventoryRecords must be used within an InventoryRecordProvider");
    }
    return context;
};

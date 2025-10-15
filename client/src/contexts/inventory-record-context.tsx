import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export interface InventoryRecord {
  _id?: string;
  userId: string;
  dateOfArrival: string;
  invoiceNumber: string;
  sku: string;
  description: string;
  quantity: number;
  amount: number;
  totalCost: number;
  expiration: string;
  remarks: string;
  status?: string;
}

interface InventoryContextType {
  inventoryRecords: InventoryRecord[];
  addRecord: (record: InventoryRecord) => Promise<void>;
  updateRecord: (id: string, updated: Partial<InventoryRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  refreshRecords: () => Promise<void>;
}

const InventoryRecordContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>([]);
  const { user } = useUser();

  // ✅ Centralized fetch function
  const refreshRecords = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(
        `http://localhost:3001/inventory-records/getAllByUserID/${user.id}`
      );
      setInventoryRecords(res.data);
    } catch (err) {
      console.error("Error fetching inventory records:", err);
    }
  };

  useEffect(() => {
    refreshRecords();
  }, [user?.id]);

  // ✅ Add record + refresh
  const addRecord = async (record: InventoryRecord) => {
    try {
      await axios.post("http://localhost:3001/inventory-records/create", record);
      await refreshRecords(); // ⬅ refresh instantly
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  // ✅ Update record + refresh
  const updateRecord = async (id: string, updated: Partial<InventoryRecord>) => {
    try {
      await axios.put(`http://localhost:3001/inventory-records/update/${id}`, updated);
      await refreshRecords(); // ⬅ refresh instantly
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  // ✅ Delete record + refresh
  const deleteRecord = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/inventory-records/delete/${id}`);
      await refreshRecords(); // ⬅ refresh instantly
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <InventoryRecordContext.Provider
      value={{ inventoryRecords, addRecord, updateRecord, deleteRecord, refreshRecords }}
    >
      {children}
    </InventoryRecordContext.Provider>
  );
};

export const useInventoryRecords = (): InventoryContextType => {
  const context = useContext(InventoryRecordContext);
  if (!context) {
    throw new Error("useInventoryRecords must be used within an InventoryRecordProvider");
  }
  return context;
};

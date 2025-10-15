import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";

export interface FinancialRecord {
    _id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
}

interface FinancialRecordContextType {
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    updateRecord: (id: string, newRecord: FinancialRecord) => void;
    deleteRecord: (id: string) => void;
}
interface FinancialRecordsProviderProps {
    children: ReactNode;
}

export const FinancialRecordsContext = createContext<
    FinancialRecordContextType | undefined
>(undefined);

export const FinancialRecordsProvider: React.FC<FinancialRecordsProviderProps> = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { user } = useUser()
    const [records, setRecords] = useState<FinancialRecord[]>([])

    const fetchRecords = async () => {
        const response = await fetch(`http://localhost:3001/financial-records/getAllByUserID/${user?.id ?? ""}`)
        if (!user) return;

        if (response.ok) {
            const records = await response.json()
            console.log(records)
            setRecords(records)
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [user])


    const addRecord = async (record: FinancialRecord) => {
        if (!user) {
            console.error("No user is found");
            return;
        }
        const payload = {
            ...record,
            userId: user.id
        }

        console.log("📤 Sending to backend:", payload)
        const response = await fetch("http://localhost:3001/financial-records", {
            method: "POST",
            body: JSON.stringify(record),
            headers: {
                'Content-Type': "application/json"
            }
        });
        try {
            if (response.ok) {
                const newRecord = await response.json()
                setRecords((prev) => [...prev, newRecord]);
            }
        } catch (err) {
            console.log(err)
        }

    };

    const updateRecord = async (id: string, newRecord: FinancialRecord) => {
      
        
        const response = await fetch(`http://localhost:3001/financial-records/${id}`, {
            method: "PUT",
            body: JSON.stringify(newRecord),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        try {
            if (response.ok) {
                const newRecord = await response.json()
                setRecords((prev) => prev.map((record) => {
                    if (record._id === id) {
                        return newRecord
                    } else {
                        return record
                    }
                }))
            }
        } catch (err) {
            console.log(err)
        }
    };
    const deleteRecord = async (id: string) => {
        const response = await fetch(`http://localhost:3001/financial-records/${id}`,{
            method: 'DELETE',
        })

        try{
            if(response.ok){
                const deleteRecord = await response.json()
                setRecords((prev) => prev.filter((record)=> record._id !== deleteRecord._id))
            }
        } catch(err){
            console.log(err)
        }
    }

    return <FinancialRecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>

        {children}
    </FinancialRecordsContext.Provider>
};

export const useFinancialRecords = () => {
    const context = useContext<FinancialRecordContextType | undefined>(
        FinancialRecordsContext
    );
    if (!context) {
        throw new Error('useFinancialRecord must be used within a FinancialRecordProvider')
    }

    return context;
}
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface Activity {
  id: string;
  fileName: string;
  source: 'email' | 'sftp' | 'upload';
  bank: string;
  status: 'completed' | 'processing' | 'failed';
  rows: number;
  timestamp: string;
  error?: string;
}

export interface StandardizedRow {
  id: string;
  sourceFile: string;
  bank: string;
  clientName: string;
  accountNo: string;
  dueAmount: number;
  dueDate: string;
  status: 'valid' | 'invalid';
  error?: string;
}

export interface AgentState {
  email: boolean;
  sftp: boolean;
}

interface MockDataContextType {
  // Activity Log
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  
  // Standardized Data
  standardizedData: StandardizedRow[];
  addStandardizedRows: (rows: Omit<StandardizedRow, 'id'>[]) => void;
  
  // Agent States
  agents: AgentState;
  toggleAgent: (agent: keyof AgentState) => Promise<void>;
  
  // Loading State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Stats
  stats: {
    filesToday: number;
    filesMonth: number;
    rowsStandardized: number;
    manHoursSaved: number;
    successRate: number;
    activeAgents: number;
    weeklyTrend: number[];
  };
}

// Initial Data
const initialActivities: Activity[] = [
  {
    id: "1",
    fileName: "CIMB_Overdue_Jan2024.xlsx",
    source: "email",
    bank: "CIMB",
    status: "completed",
    rows: 1247,
    timestamp: "2 mins ago",
  },
  {
    id: "2",
    fileName: "Maybank_Collections_Q4.xlsx",
    source: "sftp",
    bank: "Maybank",
    status: "processing",
    rows: 892,
    timestamp: "5 mins ago",
  },
  {
    id: "3",
    fileName: "Manual_Upload_RHB.xlsx",
    source: "upload",
    bank: "RHB",
    status: "completed",
    rows: 456,
    timestamp: "12 mins ago",
  },
  {
    id: "4",
    fileName: "CIMB_NPL_Dec2023.zip",
    source: "email",
    bank: "CIMB",
    status: "failed",
    rows: 0,
    timestamp: "15 mins ago",
    error: "Incorrect password",
  },
  {
    id: "5",
    fileName: "Maybank_Batch_002.xlsx",
    source: "sftp",
    bank: "Maybank",
    status: "completed",
    rows: 2103,
    timestamp: "1 hour ago",
  },
];

const initialStandardizedData: StandardizedRow[] = [
  {
    id: "1",
    sourceFile: "CIMB_Overdue_Jan2024.xlsx",
    bank: "CIMB",
    clientName: "Ahmad Bin Ali",
    accountNo: "7012345678",
    dueAmount: 15420.50,
    dueDate: "2024-01-15",
    status: "valid",
  },
  {
    id: "2",
    sourceFile: "CIMB_Overdue_Jan2024.xlsx",
    bank: "CIMB",
    clientName: "Siti Sarah Binti Abdullah",
    accountNo: "7098765432",
    dueAmount: 8750.00,
    dueDate: "2024-01-20",
    status: "valid",
  },
  {
    id: "3",
    sourceFile: "Maybank_Collections_Q4.xlsx",
    bank: "Maybank",
    clientName: "Tan Wei Ming",
    accountNo: "1142789456",
    dueAmount: 23100.75,
    dueDate: "2024-01-10",
    status: "valid",
  },
  {
    id: "4",
    sourceFile: "Maybank_Collections_Q4.xlsx",
    bank: "Maybank",
    clientName: "Rajesh A/L Kumar",
    accountNo: "1145678901",
    dueAmount: 5890.25,
    dueDate: "2024-01-25",
    status: "invalid",
    error: "Missing account type",
  },
  {
    id: "5",
    sourceFile: "Manual_Upload_RHB.xlsx",
    bank: "RHB",
    clientName: "Nurul Izzah Binti Hassan",
    accountNo: "2156789012",
    dueAmount: 12340.00,
    dueDate: "2024-01-18",
    status: "valid",
  },
  {
    id: "6",
    sourceFile: "Manual_Upload_RHB.xlsx",
    bank: "RHB",
    clientName: "Lee Chong Wei",
    accountNo: "2198765432",
    dueAmount: 45670.80,
    dueDate: "2024-01-22",
    status: "valid",
  },
  {
    id: "7",
    sourceFile: "CIMB_Overdue_Jan2024.xlsx",
    bank: "CIMB",
    clientName: "Mohammad Faiz Bin Yusof",
    accountNo: "7034567890",
    dueAmount: 9200.00,
    dueDate: "2024-01-28",
    status: "valid",
  },
  {
    id: "8",
    sourceFile: "Maybank_Collections_Q4.xlsx",
    bank: "Maybank",
    clientName: "Priya A/P Subramaniam",
    accountNo: "1178901234",
    dueAmount: 18500.50,
    dueDate: "2024-01-12",
    status: "valid",
  },
];

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [standardizedData, setStandardizedData] = useState<StandardizedRow[]>(initialStandardizedData);
  const [agents, setAgents] = useState<AgentState>({ email: true, sftp: true });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    filesToday: 47,
    filesMonth: 1284,
    rowsStandardized: 156789,
    manHoursSaved: 120,
    successRate: 98.5,
    activeAgents: 2,
    weeklyTrend: [32, 41, 38, 52, 47, 45, 47], // Last 7 days
  });

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities((prev) => [newActivity, ...prev]);
    
    // Update stats
    setStats((prev) => ({
      ...prev,
      filesToday: prev.filesToday + 1,
      filesMonth: prev.filesMonth + 1,
      weeklyTrend: [...prev.weeklyTrend.slice(1), prev.weeklyTrend[6] + 1],
    }));
  }, []);

  const addStandardizedRows = useCallback((rows: Omit<StandardizedRow, 'id'>[]) => {
    const newRows = rows.map((row, index) => ({
      ...row,
      id: `${Date.now()}-${index}`,
    }));
    setStandardizedData((prev) => [...newRows, ...prev]);
    
    // Update stats
    const validRows = rows.filter((r) => r.status === 'valid').length;
    setStats((prev) => ({
      ...prev,
      rowsStandardized: prev.rowsStandardized + validRows,
      manHoursSaved: prev.manHoursSaved + Math.floor(validRows / 10),
    }));
  }, []);

  const toggleAgent = useCallback(async (agent: keyof AgentState) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setAgents((prev) => {
      const newState = { ...prev, [agent]: !prev[agent] };
      // Update active agents count
      const activeCount = Object.values(newState).filter(Boolean).length;
      setStats((prevStats) => ({
        ...prevStats,
        activeAgents: activeCount,
      }));
      return newState;
    });
  }, []);

  return (
    <MockDataContext.Provider
      value={{
        activities,
        addActivity,
        standardizedData,
        addStandardizedRows,
        agents,
        toggleAgent,
        isLoading,
        setIsLoading,
        stats,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}

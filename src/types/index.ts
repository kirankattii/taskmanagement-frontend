// types/index.ts
export interface UserData {
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userData: UserData | false;
  setUserData: (value: UserData | false) => void;
  getUserData: () => Promise<void>;
  getTaskData: () => Promise<void>;
  tasks: Tasks[];
  setTasks: (value: Tasks[]) => void;
}


export type DashboardData = {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
};

export type Filters = {
  sortBy: "startTime" | "endTime" | "";
  priority: "Low" | "Medium" | "High" | "";
  status: "Pending" | "In Progress" | "Completed" | "";
};

// types.ts// types.ts
export interface Tasks {
  _id: string;
  title: string;
  priority: string;
  status: string;
  startTime: string;
  endTime: string;
}


export interface ApiResponse {
  success: boolean;
  tasks?: Tasks[];
  task?: Tasks;
  message?: string;
}

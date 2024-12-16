
import React, { useContext, useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Tasks } from '../types'; 
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'; // Import icons
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface SortConfig {
  field: 'startTime' | 'endTime' | null;
  direction: 'asc' | 'desc' | null;
}




const Task: React.FC = () => {
  const { backendUrl } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [tasks, setTasks] = useState<Tasks[]>([]);
// const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [statusFilter, setStatusFilter] = useState<string>("");
const [priorityFilter, setPriorityFilter] = useState<string>("");
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/task`); // Fixed template literal syntax
      console.log(response);
      
      if (response.data.success && response.data.tasks) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (newTask: Tasks) => {
    try {
      const response = await axios.post(`${backendUrl}/api/task`, newTask); // Fixed template literal syntax
      if (response.data.success) {
        toast.success('Task added successfully');
        fetchTasks();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };



  const [taskToEdit, setTaskToEdit] = useState<Tasks | null>(null);

const handleEditTask = (task: Tasks) => {
  setTaskToEdit(task);
  setIsModalOpen(true);
};

const handleUpdateTask = async (updatedTask: Tasks) => {
  try {
    const response = await axios.put(`${backendUrl}/api/task/${updatedTask._id}`, updatedTask);
    if (response.data.success) {
      toast.success("Task updated successfully");
      fetchTasks();
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  } finally {
    setTaskToEdit(null);
  }
};

    const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await axios.delete(`${backendUrl}/api/task/${taskId}`);
        if (response.data.success) {
          toast.success('Task deleted successfully');
          fetchTasks();
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };
  
  


const [sortConfig, setSortConfig] = useState<SortConfig>({
  field: null,
  direction: null
});

// Add this sorting function
const getSortedAndFilteredTasks = () => {
  let filteredTasks = tasks.filter(task => {
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  if (sortConfig.field && sortConfig.direction) {
    filteredTasks.sort((a, b) => {
      const aDate = new Date(a[sortConfig.field!]).getTime();
      const bDate = new Date(b[sortConfig.field!]).getTime();
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    });
  }

  return filteredTasks;
};

// Add this handler for sort clicks
const handleSort = (field: 'startTime' | 'endTime') => {
  setSortConfig(prevConfig => ({
    field,
    direction: 
      prevConfig.field === field && prevConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc'
  }));
};


  
  
  return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto  sm:px-0 lg:px-4 py-6 md:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your tasks effectively
              </p>
            </div>
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add <span className="hidden md:inline">New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto md:px-4 sm:px-0 lg:px-8 py-8 ">
        {/* Filters  */}
        <div className="bg-white rounded-lg sm:p-0 md:p-6  mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {statusFilter && (
                  <button
                    onClick={() => setStatusFilter("")}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {priorityFilter && (
                  <button
                    onClick={() => setPriorityFilter("")}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>


          </div>
        </div>

        {/* Sort  */}
<div className="mt-4 flex flex-wrap gap-4">
  <div className="flex items-center gap-4">
    <span className="text-sm font-medium text-gray-700">Sort by:</span>
    
    <button
      onClick={() => handleSort('startTime')}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors
        ${sortConfig.field === 'startTime' 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'}`}
    >
      Start Date
      {sortConfig.field === 'startTime' && (
        sortConfig.direction === 'asc' 
          ? <ArrowUpIcon className="h-4 w-4" />
          : <ArrowDownIcon className="h-4 w-4" />
      )}
    </button>

    <button
      onClick={() => handleSort('endTime')}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors
        ${sortConfig.field === 'endTime' 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'}`}
    >
      End Date
      {sortConfig.field === 'endTime' && (
        sortConfig.direction === 'asc' 
          ? <ArrowUpIcon className="h-4 w-4" />
          : <ArrowDownIcon className="h-4 w-4" />
      )}
    </button>
  </div>
</div>


        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md">
          <TaskList
             tasks={getSortedAndFilteredTasks()}
            loading={loading}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>

      {/* dialog */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onAddTask={taskToEdit ? handleUpdateTask : handleAddTask}
        initialData={taskToEdit}
      />
    </div>
  );
};

export default Task;

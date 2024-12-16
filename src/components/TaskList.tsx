

import React from "react";
import { PencilIcon, TrashIcon, ClockIcon, FlagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Task {
  _id: string;
  title: string;
  priority: string;
  status: string;
  startTime: string;
  endTime: string;
}

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}



const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onEditTask, onDeleteTask }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMs = end.getTime() - start.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours < 0 ? "0.00" : diffInHours.toFixed(2);
};
  // Function to get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };


  

  return (

    <div>
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
         {tasks.length>0?
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FlagIcon className={`h-5 w-5 ${getPriorityColor(task.priority)} mr-2`} />
                    <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {task.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <div className="text-sm text-gray-500">
                      <div>{new Date(task.startTime).toLocaleString()}</div>
                      <div>{new Date(task.endTime).toLocaleString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculateDuration(task.startTime, task.endTime)} hours
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEditTask(task)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>:
          <div className="h-[40vh] w-full m-auto flex pt-10 justify-center">
            <h1 className="text-2xl font-bold justify-center text-gray-400   " >No tasks found</h1></div>}
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {/* Title */}
            <div className="font-medium text-gray-900 text-lg mb-3">{task.title}</div>

            {/* Priority & Status Row */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <FlagIcon className={`h-5 w-5 ${getPriorityColor(task.priority)} mr-2`} />
                <span className={getPriorityColor(task.priority)}>{task.priority}</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {task.status}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div>Start: {new Date(task.startTime).toLocaleString()}</div>
                  <div>End: {new Date(task.endTime).toLocaleString()}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500 pl-7">
                Duration: {calculateDuration(task.startTime, task.endTime)} hours
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => onEditTask(task)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDeleteTask(task._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TaskList;

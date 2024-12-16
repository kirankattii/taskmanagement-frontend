



import { FC, useState } from "react";
import Navbar from "../components/Navbar";
import Task from "./Task";
import { HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Dashboard from "./Dashboard";

const Home: FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const tabs = [
    { id: 1, name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { id: 2, name: 'Tasks', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="pt-20 flex bg-[url('/bg_img.png')] bg-cover bg-center min-h-screen bg-fixed">
      <Navbar />
      
      <div className="flex-1 md:p-8 sm:p-0 sm:pt-8">
        <div className="max-w-7xl  mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Welcome to Dashboard</h3>
              <Dashboard/>
              </div>
            )}
            {activeTab === 2 && (
              <div className="bg-white rounded-lg">
                <Task />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

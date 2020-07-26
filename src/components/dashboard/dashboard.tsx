import React from "react";
import DirectoryView from "components/dashboard/directoryView/directoryView";
import { useLocation } from 'react-router-dom'
import FileTree from "./fileTree";


const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <FileTree path={useLocation().pathname.replace("/dashboard","")}/>
      <DirectoryView path={useLocation().pathname.replace("/dashboard","")}/>
    </div>
    );
  };
  
export default Dashboard;
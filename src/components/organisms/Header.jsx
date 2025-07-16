import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";
import Button from "@/components/atoms/Button";

const Header = ({ 
  sessionData, 
  onExport, 
  onReset,
  isExporting = false 
}) => {
  const progress = sessionData ? (sessionData.verifiedCount / sessionData.totalProfiles) * 100 : 0;
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="UserCheck" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Profile Verifier</h1>
              <p className="text-sm text-gray-600">LinkedIn Profile Verification Tool</p>
            </div>
          </div>
          
          {sessionData && (
            <div className="flex items-center space-x-4 ml-8">
              <ProgressRing progress={progress} size={50} />
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {sessionData.verifiedCount} of {sessionData.totalProfiles} verified
                </div>
                <div className="text-gray-600">
                  {sessionData.totalProfiles - sessionData.verifiedCount} remaining
                </div>
              </div>
            </div>
          )}
        </div>
        
        {sessionData && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Reset
            </Button>
            
            <Button
              variant="primary"
              onClick={onExport}
              disabled={isExporting || sessionData.verifiedCount === 0}
              className="flex items-center"
            >
              {isExporting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export Results
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
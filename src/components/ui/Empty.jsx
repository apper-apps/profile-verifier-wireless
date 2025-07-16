import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data yet", 
  description = "Upload a file to get started",
  actionLabel = "Upload File",
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="FileText" size={40} className="text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            className="flex items-center"
          >
            <ApperIcon name="Upload" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg max-w-md">
        <h4 className="font-medium text-gray-900 mb-3">Get started quickly:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <ApperIcon name="Check" size={16} className="text-success mr-2" />
            Upload your CSV or Excel file
          </div>
          <div className="flex items-center">
            <ApperIcon name="Check" size={16} className="text-success mr-2" />
            Review profiles in the table
          </div>
          <div className="flex items-center">
            <ApperIcon name="Check" size={16} className="text-success mr-2" />
            Verify matches with LinkedIn
          </div>
          <div className="flex items-center">
            <ApperIcon name="Check" size={16} className="text-success mr-2" />
            Export verified results
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;
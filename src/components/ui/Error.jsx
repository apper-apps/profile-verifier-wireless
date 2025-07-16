import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  onReset 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="AlertCircle" size={32} className="text-error" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              className="flex items-center"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
          
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center"
            >
              <ApperIcon name="Home" size={16} className="mr-2" />
              Start Over
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md">
        <h4 className="font-medium text-gray-900 mb-2">Common issues:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check your internet connection</li>
          <li>• Verify your file format is correct</li>
          <li>• Ensure required columns are present</li>
          <li>• Try uploading a smaller file</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Error;
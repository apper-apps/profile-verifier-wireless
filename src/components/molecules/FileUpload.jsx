import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FileUpload = ({ onFileUpload, acceptedTypes = ".csv,.xlsx,.xls" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      await onFileUpload(file);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div
        className={cn(
          "upload-zone rounded-lg p-8 text-center transition-all duration-200",
          isDragOver && "dragover",
          isProcessing && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <ApperIcon name="Upload" size={32} className="text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Upload your LinkedIn profile data
            </h3>
            <p className="text-sm text-gray-600">
              Drag and drop your CSV or Excel file here, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Required columns: firstname, lastname, organization, linkedin_url
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={() => document.getElementById("file-input").click()}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <ApperIcon name="File" size={16} className="mr-2" />
                  Choose File
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={() => window.open("https://linkedin.com", "_blank")}>
              <ApperIcon name="ExternalLink" size={16} className="mr-2" />
              Open LinkedIn
            </Button>
          </div>

          <input
            id="file-input"
            type="file"
            accept={acceptedTypes}
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">File Format Requirements:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• CSV or Excel file (.csv, .xlsx, .xls)</li>
          <li>• Must contain columns: firstname, lastname, organization, linkedin_url</li>
          <li>• First row should contain column headers</li>
          <li>• LinkedIn URLs should be complete profile URLs</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default FileUpload;
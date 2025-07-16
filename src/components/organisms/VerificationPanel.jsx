import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import KeyboardHint from "@/components/molecules/KeyboardHint";

const VerificationPanel = ({ 
  selectedProfile, 
  onVerify, 
  onNext, 
  onPrevious,
  currentIndex,
  totalProfiles 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "y" || e.key === "Y") {
      onVerify("yes");
    } else if (e.key === "n" || e.key === "N") {
      onVerify("no");
    } else if (e.key === "ArrowRight") {
      onNext();
    } else if (e.key === "ArrowLeft") {
      onPrevious();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedProfile]);

  if (!selectedProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <ApperIcon name="UserCheck" size={32} className="text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Select a profile to verify
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Click on any profile in the table to start verification
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profile Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Verification
          </h3>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {totalProfiles}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {selectedProfile.firstname} {selectedProfile.lastname}
              </h4>
              <p className="text-sm text-gray-600">{selectedProfile.organization}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">LinkedIn Profile:</span>
              <a
                href={selectedProfile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center"
              >
                <ApperIcon name="ExternalLink" size={16} className="mr-1" />
                Open in LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Verification Controls */}
      <Card className="p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Does this LinkedIn profile match the name and organization?
        </h4>
        
        <div className="space-y-4">
          <div className="flex space-x-3">
            <Button
              variant="success"
              size="lg"
              onClick={() => onVerify("yes")}
              className="flex-1"
            >
              <ApperIcon name="CheckCircle" size={20} className="mr-2" />
              Yes, it matches
              <span className="keyboard-hint">Y</span>
            </Button>
            
            <Button
              variant="error"
              size="lg"
              onClick={() => onVerify("no")}
              className="flex-1"
            >
              <ApperIcon name="XCircle" size={20} className="mr-2" />
              No, it doesn't match
              <span className="keyboard-hint">N</span>
            </Button>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="flex-1"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={onNext}
              disabled={currentIndex === totalProfiles - 1}
              className="flex-1"
            >
              Next
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="p-4 bg-gray-50">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Keyboard Shortcuts</h5>
        <div className="space-y-1">
          <KeyboardHint keys={["Y"]} description="Mark as match" />
          <KeyboardHint keys={["N"]} description="Mark as no match" />
          <KeyboardHint keys={["←", "→"]} description="Navigate profiles" />
        </div>
      </Card>
    </motion.div>
  );
};

export default VerificationPanel;
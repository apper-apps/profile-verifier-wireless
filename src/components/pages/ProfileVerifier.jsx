import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useVerificationSession } from "@/hooks/useVerificationSession";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import ProfileTable from "@/components/organisms/ProfileTable";
import VerificationPanel from "@/components/organisms/VerificationPanel";
import Header from "@/components/organisms/Header";
import FileUpload from "@/components/molecules/FileUpload";
import Button from "@/components/atoms/Button";

const ProfileVerifier = () => {
    const {
      profiles,
      selectedProfile,
      sessionData,
      loading,
      error,
      currentIndex,
      handleFileUpload,
      handleProfileSelect,
      handleVerify,
      handleNext,
      handlePrevious,
      handleExport,
      handleReset,
      loadProfiles
    } = useVerificationSession();

    const [selectedProfiles, setSelectedProfiles] = React.useState([]);
    const [bulkLoading, setBulkLoading] = React.useState(false);

    // All hooks must be called before any conditional returns
    useEffect(() => {
        const handleProfilesUpdate = (event) => {
            // This would typically be handled by the verification session hook
            // For now, we'll trigger a reload
            loadProfiles();
        };
        
        window.addEventListener('profilesUpdated', handleProfilesUpdate);
        return () => window.removeEventListener('profilesUpdated', handleProfilesUpdate);
    }, [loadProfiles]);

    // Conditional returns after all hooks
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <Loading message="Processing your file..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <Error message={error} onRetry={loadProfiles} onReset={handleReset} />
            </div>
        );
    }

    if (!profiles || profiles.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Empty onUpload={handleFileUpload} />
                </div>
            </div>
        );
    }

    const handleSelectionChange = (newSelectedProfiles) => {
        setSelectedProfiles(newSelectedProfiles);
    };

    const handleBulkVerification = async (status) => {
        if (selectedProfiles.length === 0) return;
        
        setBulkLoading(true);
        try {
            const updatedProfiles = await profileService.bulkUpdateVerificationStatus(
                selectedProfiles.map(p => p.id),
                status
            );
            
            const updatedProfilesMap = new Map(updatedProfiles.map(p => [p.id, p]));
            const newProfiles = profiles.map(p => updatedProfilesMap.get(p.id) || p);
            
            // Dispatch custom event to update profiles
            const event = new CustomEvent('profilesUpdated', { detail: newProfiles });
            window.dispatchEvent(event);
            
            setSelectedProfiles([]);
            
            const nextProfile = newProfiles.find(p => p.verificationStatus === 'pending');
            if (nextProfile) {
                handleProfileSelect(nextProfile);
            }
        } catch (error) {
            console.error('Bulk verification failed:', error);
        } finally {
            setBulkLoading(false);
        }
    };

    const totalProfiles = profiles.length;
    const completedProfiles = profiles.filter(p => p.verificationStatus !== 'pending').length;
    const progress = totalProfiles > 0 ? (completedProfiles / totalProfiles) * 100 : 0;

const currentProfile = selectedProfile || profiles[currentIndex] || profiles[0];

    const handleKeyDown = (e) => {

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
    };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        sessionData={sessionData}
        onExport={handleExport}
        onReset={handleReset}
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Table */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile List
                </h2>
                <p className="text-sm text-gray-600">
                  Click on any profile to start verification
                </p>
</div>
              
              {/* Bulk Actions */}
              {selectedProfiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="CheckSquare" size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {selectedProfiles.length} profile{selectedProfiles.length > 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleBulkVerification("yes")}
                        disabled={bulkLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                      >
                        {bulkLoading ? (
                          <ApperIcon name="Loader2" size={14} className="animate-spin mr-2" />
                        ) : (
                          <ApperIcon name="Check" size={14} className="mr-2" />
                        )}
                        Mark as Yes
                      </Button>
                      <Button
                        onClick={() => handleBulkVerification("no")}
                        disabled={bulkLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
                      >
                        {bulkLoading ? (
                          <ApperIcon name="Loader2" size={14} className="animate-spin mr-2" />
                        ) : (
                          <ApperIcon name="X" size={14} className="mr-2" />
                        )}
                        Mark as No
                      </Button>
                      <Button
                        onClick={() => setSelectedProfiles([])}
                        variant="outline"
                        className="px-4 py-2 text-sm"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <ProfileTable
                profiles={profiles}
                selectedProfile={selectedProfile}
                onProfileSelect={handleProfileSelect}
                selectedProfiles={selectedProfiles}
                onSelectionChange={handleSelectionChange}
              />
            </motion.div>
          </div>

          {/* Verification Panel */}
          <div className="lg:col-span-1">
            <VerificationPanel
              selectedProfile={selectedProfile}
              onVerify={handleVerify}
              onNext={handleNext}
              onPrevious={handlePrevious}
              currentIndex={currentIndex}
              totalProfiles={profiles.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerifier;
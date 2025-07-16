import React from "react";
import { motion } from "framer-motion";
import { useVerificationSession } from "@/hooks/useVerificationSession";
import Header from "@/components/organisms/Header";
import FileUpload from "@/components/molecules/FileUpload";
import ProfileTable from "@/components/organisms/ProfileTable";
import VerificationPanel from "@/components/organisms/VerificationPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

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
        <Error 
          message={error} 
          onRetry={loadProfiles}
          onReset={handleReset}
        />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <Empty
            title="Ready to verify profiles?"
            description="Upload your CSV or Excel file with LinkedIn profile data to get started with verification."
            actionLabel="Upload File"
            onAction={() => document.getElementById("file-input")?.click()}
          />
          <div className="mt-8">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      </div>
    );
  }

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
              
              <ProfileTable
                profiles={profiles}
                selectedProfile={selectedProfile}
                onProfileSelect={handleProfileSelect}
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
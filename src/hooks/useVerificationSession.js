import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import profileService from "@/services/api/profileService";

export const useVerificationSession = () => {
  const [sessionData, setSessionData] = useLocalStorage("verificationSession", null);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getAll();
      setProfiles(data);
      
      if (data.length > 0 && !selectedProfile) {
        setSelectedProfile(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionData = async () => {
    if (profiles.length === 0) return;
    
    const verifiedCount = profiles.filter(p => p.verificationStatus).length;
    const totalProfiles = profiles.length;
    
    setSessionData({
      id: sessionData?.id || Date.now().toString(),
      totalProfiles,
      verifiedCount,
      startedAt: sessionData?.startedAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
  };

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const parsedProfiles = await profileService.parseFile(file);
      setProfiles(parsedProfiles);
      
      if (parsedProfiles.length > 0) {
        setSelectedProfile(parsedProfiles[0]);
        setSessionData({
          id: Date.now().toString(),
          totalProfiles: parsedProfiles.length,
          verifiedCount: 0,
          startedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleVerify = async (status) => {
    if (!selectedProfile) return;
    
    try {
      const updatedProfile = await profileService.updateVerificationStatus(
        selectedProfile.Id,
        status
      );
      
      setProfiles(prev => 
        prev.map(p => p.Id === updatedProfile.Id ? updatedProfile : p)
      );
      
      // Auto-advance to next unverified profile
      const nextProfile = profiles.find(p => 
        p.Id !== selectedProfile.Id && !p.verificationStatus
      );
      
      if (nextProfile) {
        setSelectedProfile(nextProfile);
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNext = () => {
    if (!selectedProfile) return;
    
    const currentIndex = profiles.findIndex(p => p.Id === selectedProfile.Id);
    if (currentIndex < profiles.length - 1) {
      setSelectedProfile(profiles[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!selectedProfile) return;
    
    const currentIndex = profiles.findIndex(p => p.Id === selectedProfile.Id);
    if (currentIndex > 0) {
      setSelectedProfile(profiles[currentIndex - 1]);
    }
  };

  const handleExport = async () => {
    try {
      await profileService.exportToCsv();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    profileService.reset();
    setProfiles([]);
    setSelectedProfile(null);
    setSessionData(null);
    setError(null);
  };

  const getCurrentIndex = () => {
    if (!selectedProfile) return -1;
    return profiles.findIndex(p => p.Id === selectedProfile.Id);
  };

  useEffect(() => {
    if (profiles.length > 0) {
      updateSessionData();
    }
  }, [profiles]);

  useEffect(() => {
    if (sessionData && profiles.length === 0) {
      loadProfiles();
    }
  }, [sessionData]);

  return {
    profiles,
    selectedProfile,
    sessionData,
    loading,
    error,
    currentIndex: getCurrentIndex(),
    handleFileUpload,
    handleProfileSelect,
    handleVerify,
    handleNext,
    handlePrevious,
    handleExport,
    handleReset,
    loadProfiles
  };
};
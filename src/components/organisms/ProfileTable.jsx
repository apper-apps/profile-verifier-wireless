import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import { cn } from "@/utils/cn";

const ProfileTable = ({ profiles, selectedProfile, onProfileSelect, selectedProfiles = [], onSelectionChange }) => {
    const handleRowClick = (profile) => {
      onProfileSelect(profile);
    };

    const handleCheckboxChange = (profileId, checked) => {
      if (checked) {
        onSelectionChange([...selectedProfiles, profileId]);
      } else {
        onSelectionChange(selectedProfiles.filter(id => id !== profileId));
      }
    };

    const handleSelectAll = (checked) => {
      if (checked) {
        onSelectionChange(profiles.map(p => p.Id));
      } else {
        onSelectionChange([]);
      }
    };

    const getRowClassName = (profile) => {
      return cn(
        "table-row cursor-pointer transition-all duration-150",
        selectedProfile?.Id === profile.Id && "selected"
      );
    };

    const isAllSelected = profiles.length > 0 && selectedProfiles.length === profiles.length;
    const isIndeterminate = selectedProfiles.length > 0 && selectedProfiles.length < profiles.length;

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="table-container"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={checkbox => {
                  if (checkbox) checkbox.indeterminate = isIndeterminate;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organization
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              LinkedIn URL
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {profiles.map(profile => (
            <tr
              key={profile.Id}
              onClick={() => handleRowClick(profile)}
              className={getRowClassName(profile)}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedProfiles.includes(profile.Id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(profile.Id, e.target.checked);
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {profile.firstname} {profile.lastname}
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{profile.organization}</div>
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ApperIcon name="ExternalLink" size={14} className="mr-1" />
                    View Profile
                  </a>
                </div>
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge status={profile.verificationStatus || "pending"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProfileTable;
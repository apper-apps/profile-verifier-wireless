import React from "react";
import { motion } from "framer-motion";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ProfileTable = ({ profiles, selectedProfile, onProfileSelect }) => {
  const handleRowClick = (profile) => {
    onProfileSelect(profile);
  };

  const getRowClassName = (profile) => {
    return cn(
      "table-row cursor-pointer transition-all duration-150",
      selectedProfile?.Id === profile.Id && "selected"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="table-container"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
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
          {profiles.map((profile) => (
            <tr
              key={profile.Id}
              onClick={() => handleRowClick(profile)}
              className={getRowClassName(profile)}
            >
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
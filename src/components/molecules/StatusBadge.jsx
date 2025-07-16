import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      variant: "pending",
      label: "Pending",
      icon: "Clock"
    },
    yes: {
      variant: "success",
      label: "Match",
      icon: "CheckCircle"
    },
    no: {
      variant: "error",
      label: "No Match",
      icon: "XCircle"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
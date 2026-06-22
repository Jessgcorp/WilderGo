import React from "react";
import { FriendsProfileCard } from "./FriendsProfileCard";

// Simple wrapper to preserve legacy component name `NomadProfileCard`
export const NomadProfileCard = (props: any) => {
  return <FriendsProfileCard {...props} />;
};

export default NomadProfileCard;

/**
 * File: status_cards.jsx
 * Description: Handles the status cards component for the admin dashboard.
 *
 * Created By: Kossai Baha
 * Created On: 16-Nov-2025
 * Version: 1.0.0
 * Last Modified By: Kossai Baha
 * Last Modified On: 16-Nov-2025
 *
 * Notes:
 */
import React from "react";
import { Camera, Plane, TrendingDown, TrendingUp } from "lucide-react";
import "../../../styles/admin_dashboard/admin_dashboard.css";

// General card structure for status cards (compact)
export const StatusCard = ({
  bgColor = "#FFFFFF",
  title = "",
  titleColor = "#495057",
  amount = "0",
  amountColor = "#117BB8",
  icon = Plane,
  iconColor = "#495057",
  profit = true,
  profitColor = "#117BB8",
  subTitle = "",
  subTitleColor = "#C6CCD2",
}) => {
  return (
    <div
      className="container m-2 px-4 py-8 border-1 border-[#C6CCD2] rounded-4xl hover:shadow-md transition-shadow duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl" style={{ color: titleColor }}>
            {title}
          </h3>
          {React.createElement(icon, { size: 24, color: iconColor })}
        </div>
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-2xl sm:text-3xl" style={{ color: amountColor }}>
            {amount}
          </h1>
          <div className="m-0">
            <div className="flex flex-row justify-end items-center space-x-2">
              {profit ? (
                <TrendingUp size={20} color={profitColor} />
              ) : (
                <TrendingDown size={20} color={profitColor} />
              )}
              <h3 className="text-lg" style={{ color: profitColor }}>
                3.6%
              </h3>
            </div>

            <h3 className="text-sm" style={{ color: subTitleColor }}>
              {subTitle}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

// Decorated card (compact)
export const DecoratedCard = ({
  bgColor = "#117BB8",
  title = "",
  titleColor = "#FFFFFF",
  amount = "0",
  amountColor = "#FFFFFF",
  icon = Plane,
  iconColor = "#FFFFFF",
  profit = true,
  profitColor = "#FFFFFF",
  subTitle = "",
  subTitleColor = "##FFFFFF",
}) => {
  return (
    <div
      className="multi-shade-card container m-2 px-4 py-8  border-[#C6CCD2] rounded-4xl hover:shadow-md transition-shadow duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl" style={{ color: titleColor }}>
            {title}
          </h3>
          {React.createElement(icon, { size: 24, color: iconColor })}
        </div>
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-2xl sm:text-3xl" style={{ color: amountColor }}>
            {amount}
          </h1>
          <div className="m-0">
            <div className="flex flex-row justify-end items-center space-x-2">
              {profit ? (
                <TrendingUp size={20} color={profitColor} />
              ) : (
                <TrendingDown size={20} color={profitColor} />
              )}
              <h3 className="text-lg" style={{ color: profitColor }}>
                3.6%
              </h3>
            </div>

            <h3 className="text-sm" style={{ color: subTitleColor }}>
              {subTitle}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

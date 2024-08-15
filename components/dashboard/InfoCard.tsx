import React, { ReactNode } from 'react';

interface CardProps {
    title: string;
    description: string;
    icon?: ReactNode; // Allow a ReactNode for the icon
    iconColor?: string; // Optional prop to customize the background color of the icon container
    titleColor?: string; // Optional prop to customize the title color
    descriptionColor?: string; // Optional prop to customize the description color
}

const InfoCard: React.FC<CardProps> = ({
    title,
    description,
    icon,
    iconColor = 'bg-green-200',
    titleColor = 'text-gray-800',
    descriptionColor = 'text-gray-400',
}) => {
    return (
        <div className="w-64 p-4 py-6 bg-white shadow-lg rounded-2xl">
            <div className="flex flex-col items-center justify-center">
                <div className={`relative w-24 h-24 ${iconColor} rounded-full flex items-center justify-center`}>
                    {icon} {/* Render the passed icon */}
                </div>
                <p className={`mt-4 mb-4 text-xl font-medium ${titleColor}`}>
                    {title}
                </p>
                <p className={`px-2 text-s text-center ${descriptionColor}`}>
                    {description}
                </p>
            </div>
        </div>
    );
};

export default InfoCard;
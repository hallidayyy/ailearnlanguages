import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface PlanStatusCardProps {
    title: string;
    value: string;
    buttonText: string;
    onCancelClick: () => void;
    footerText: string;
    status: string;
}

const PlanStatusCard: React.FC<PlanStatusCardProps> = ({
    title,
    value,
    buttonText,
    onCancelClick,
    footerText,
    status,
}) => {
    return (
        <div className="w-64 p-4 bg-white shadow-2xl rounded-2xl dark:bg-gray-800">
            <div className="flex items-center">
                <span className="relative p-2 text-2xl text-purple-500">
                    <FontAwesomeIcon icon={faTicketAlt} />
                </span>
                <p className="ml-2 text-black text-md dark:text-white">{title}</p>
            </div>
            <div className="flex flex-col justify-start">
                <p className="my-4 text-2xl font-bold text-left text-gray-700 dark:text-gray-100">
                    {value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {status}
                </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Expired at: {footerText}</p>
            <button
                onClick={onCancelClick}
                className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
                {buttonText}
            </button>
        </div>
    );
};

export default PlanStatusCard;
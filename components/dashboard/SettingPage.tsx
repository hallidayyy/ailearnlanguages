import React, { useState, useEffect, useContext } from 'react';
import { findUserByEmail, findUserByID, updateUserNicknameByEmail } from '@/models/user'; // 假设 findUserByEmail 和 updateUserNicknameByEmail 函数在你的 userService 模块中定义
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingPage: React.FC = () => {
    const [username, setUsername] = useState<string>('halliday');
    const [email, setEmail] = useState<string>('abc@abc.com');
    const { lang, user } = useContext(AppContext); // 从 AppContext 中获取 user 信息

    const inputClassNames = "rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent";
    const buttonClassNames = "mt-4 py-2 px-4 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50";

    useEffect(() => {
        const fetchUser = async () => {
            const user = await findUserByEmail(email); // 使用 email 状态变量
            if (user) {
                setUsername(user.nickname);
            }
        };

        fetchUser();
        console.log("user id:" + user?.user_id);
    }, [email]);

    const handleUpdateProfile = async () => {
        try {
            await updateUserNicknameByEmail(email, username);
            // alert("Profile updated successfully!");
            toast.success("profile updated successfully");
        } catch (error) {
            // console.error("Error updating profile:", error);
            // alert("Failed to update profile. Please try again.");
            toast.error("failed to update profile. please try again");
        }
    };

    return (
        <div className="w-full">
            <div className="container max-w-8xl px-4 mx-auto sm:px-8">
                <div className="py-8">
                    <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
                        <h2 className="text-2xl leading-tight">
                            settings
                        </h2>
                    </div>
                    <hr className="my-4 border-gray-300" /> {/* Horizontal line */}
                    <div className="py-8 space-y-8">
                        <div className="space-y-6">
                            {/* Username Setting */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="username" className="text-gray-700">
                                    username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={inputClassNames}
                                />
                                <span className="text-gray-700">
                                    your publicly displayed name. it can be your real name or a pseudonym.
                                </span>
                            </div>

                            {/* Email Setting */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="email" className="text-gray-700">
                                    email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    disabled // Email is disabled
                                    className={inputClassNames + " bg-gray-100 cursor-not-allowed"} // Disabled style
                                />
                                <span className="text-gray-700">
                                    email is your login credential and cannot be changed.
                                </span>
                            </div>
                        </div>

                        {/* Update Profile Button */}
                        <button className={buttonClassNames} onClick={handleUpdateProfile}>
                            update profile
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default SettingPage;
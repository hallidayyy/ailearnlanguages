import React from 'react';
import { getUserQuota } from '@/services/order'; // 假设你有一个 getUserQuota 函数
import { getDb } from '@/models/db'; // 假设你有一个 getDb 函数
import { v4 as uuidv4 } from 'uuid';

interface AccessBlockProps {
  onSubscribeClick: () => void; // 添加 onSubscribeClick 属性
  handleRunAI: () => void; // 添加 handleRunAI 属性
  user: {
    user_id: number;
    email: string;
  };
  episodeId: string;
  card_id: string;
}

const AccessBlock: React.FC<AccessBlockProps> = ({ onSubscribeClick, handleRunAI, user, episodeId, card_id }) => {
  const handleAccessAIContent = async () => {
    const userQuota = await getUserQuota(user.email);

    if (!userQuota) {
      console.error("User not found or quota information missing.");
      return;
    }

    if (userQuota.access_content_quota <= 1 && userQuota.access_content_quota !== -1) {
      console.error("Access content quota is insufficient.");
      return;
    }

    const permissionId = uuidv4();

    const permissionData = {
      id: permissionId,
      user_id: user.user_id,
      episode_id: episodeId,
      permission: true,
    };

    try {
      const supabase = await getDb();
      const { error: permissionError } = await supabase
        .from('user_episodes_permissions')
        .insert([permissionData]);

      if (permissionError) {
        console.error("Error inserting permission: ", permissionError);
        return;
      }

      if (userQuota.access_content_quota !== -1) {
        // 扣减 access_content_quota
        const { error: quotaError } = await supabase
          .from('quota')
          .update({ access_content_quota: userQuota.access_content_quota - 1 })
          .eq('user_id', userQuota.user_id);

        if (quotaError) {
          console.error("Error updating access content quota: ", quotaError);
          // 你可能需要在这里处理扣减失败的情况，例如回滚权限插入操作
          return;
        }
      }

      console.log("Permission inserted and quota decremented successfully.");
    } catch (error) {
      console.error("Error handling access AI content: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg shadow-md">
      {card_id && (
        <button
          className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
          onClick={handleAccessAIContent} // 添加点击事件处理函数
        >
          ✨ Access AI Contents
        </button>
      )}
      <div className="text-center text-gray-700 mt-4">
        <p>4 episodes per month for free.</p>
        <p>2 episodes left this month.</p>
      </div>
      <div className="mt-4">
        <p className="text-center text-gray-700">Get unlimited access:</p>
        <button
          className="mt-2 bg-white border border-gray-300 text-black px-4 py-2 rounded-md flex items-center font-medium hover:bg-gray-100 transition-colors"
          onClick={onSubscribeClick} // 添加点击事件处理函数
        >
          👑 Subscribe
        </button>
      </div>
    </div>
  );
};

export default AccessBlock;
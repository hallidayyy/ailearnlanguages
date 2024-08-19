import React, { useState, useEffect, useContext } from 'react';
import { getUserQuota } from '@/models/quota';
import { getDb } from '@/models/db';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '@/contexts/AppContext';

interface AccessBlockProps {
  onSubscribeClick: () => void;
  handleRunAI: () => void;
  episodeId: string;
  card_id: string;
  card_id_fr: string;
  card_id_cn: string;
  card_id_jp: string;
}


const AccessBlock: React.FC<AccessBlockProps> = ({ onSubscribeClick, handleRunAI, episodeId, card_id, card_id_fr, card_id_cn, card_id_jp }) => {
  const { lang, user } = useContext(AppContext);
  const isLanguageAvailable = (lang: string) => {
    return (
      (lang === 'en' && card_id) ||
      (lang === 'fr' && card_id_fr) ||
      (lang === 'zh' && card_id_cn) ||
      (lang === 'ja' && card_id_jp)
    );
  };
  const handleAccessAIContent = async () => {
    try {
      const userQuota = await getUserQuota(user.email);
      console.log("user email: "+ user.email);
      console.log("user id"+ user.id);

      if (!userQuota || (userQuota.access_content_quota < 1 && userQuota.access_content_quota !== -1)) {
        console.error("User not found, quota information missing, or access content quota is insufficient.");
        toast.error("your quota is insufficient to access this content. please upgrade your plan or contact support.");
        return;
      }

      const permissionId = uuidv4();

      const permissionData = {
        id: permissionId,
        user_id: user.id,
        episode_id: episodeId,
        permission: true,
      };

      const supabase = await getDb();

      const { error: permissionError } = await supabase
        .from('user_episodes_permissions')
        .insert([permissionData]);

      if (permissionError) {
        console.error("Error inserting permission: ", permissionError);
        return;
      }

      if (userQuota.access_content_quota !== -1) {
        const { error: quotaError } = await supabase
          .from('quota')
          .update({ access_content_quota: userQuota.access_content_quota - 1 })
          .eq('user_id', userQuota.user_id);

        if (quotaError) {
          console.error("Error updating access content quota: ", quotaError);
          return;
        }
      }

      toast.success("you can access this article. check it out under 'episodes - access' on the left side");
    } catch (error) {
      console.error("Error handling access AI content: ", error);
      toast.error("Error handling access AI content.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      {(card_id || card_id_fr || card_id_cn || card_id_jp) && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors"
          onClick={handleAccessAIContent}
        >
          ✨ Access AI Contents
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default AccessBlock;
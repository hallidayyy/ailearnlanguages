import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import TaskCard from "@/components/requestmgmt/TaskCard";
import PendingOrDoneFilter from '@/components/requestmgmt/PendingOrDoneFilter';
import { AppContext } from '@/contexts/AppContext';
import { getDictionary } from '@/lib/i18n';

interface Task {
  id: string;
  user_id: number;
  link: string;
  title: string;
  start_time: string;
  status: string;
  card_id: number; // 确保 card_id 是 number 类型
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  });
};

const MakeRequest: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const { lang, user } = useContext(AppContext);
  const [locale, setLocale] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdInt, setUserIdInt] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const supabase = await getDb();
      let query = supabase.from('task').select('*');

      if (filters.length > 0) {
        query = query.in('status', filters);
      } else {
        setTasks([]);
        return;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data as Task[]);
      }
    };

    fetchTasks();
  }, [filters]);

  useEffect(() => {
    const fetchLocale = async () => {
      const dict = await getDictionary(lang);
      setLocale(dict);
    };

    fetchLocale();
  }, [lang]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        setUserId(user.uuid);

        const supabase = await getDb();
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('uuid', user.uuid)
          .single();

        if (userError) {
          console.error('Error fetching user id:', userError);
        } else {
          setUserIdInt(userData.id);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  if (!locale) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="text-center mt-8">
        <Link href="/makerequest" legacyBehavior>
          <a className="inline-block rounded bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring active:bg-indigo-500">
            {locale.ShowRequest.process}
          </a>
        </Link>
      </div>
      <PendingOrDoneFilter onFilterChange={setFilters} />
      <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              episode={`${task.id}`}
              title={task.title}
              description={task.link}
              duration={formatDate(task.start_time)}
              featuring={["Barry", "Sandra", "August"]}
              status={task.status}
              card_id={task.card_id}
              curr_lang={lang}
            />
          ))}
          <div className="mt-8 text-center">
            <p>Current Language: {lang}</p>
            {userId && <p>User UUID: {userId}</p>}
            {userIdInt && <p>User ID: {userIdInt}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MakeRequest;
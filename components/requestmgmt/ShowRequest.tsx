import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import TaskCard from "@/components/requestmgmt/TaskCard";
import PendingOrDoneFilter from '@/components/requestmgmt/PendingOrDoneFilter';
import { AppContext } from '@/contexts/AppContext';

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

const MakeRequest = ({ locale, CTALocale }: { locale: any; CTALocale: any }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const { lang } = useContext(AppContext);

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

  return (
    <div>
      <div className="text-center mt-8">
        <Link href="/makerequest" legacyBehavior>
          <a className="inline-block rounded bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring active:bg-indigo-500">
            Transcribe podcasts
          </a>
        </Link>
      </div>
      <PendingOrDoneFilter onFilterChange={setFilters} />
      <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              episode={`Episode #${task.id}`}
              title={task.title}
              description={task.link}
              duration={formatDate(task.start_time)}
              featuring={["Barry", "Sandra", "August"]}
              status={task.status}
              card_id={task.card_id}
            />
          ))}
          <div className="mt-8 text-center">
            <p>Current Language: {lang}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MakeRequest;
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // 导入 Link 组件
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import TaskCard from "@/components/requestmgmt/TaskCard";
import PendingOrDoneFilter from '@/components/requestmgmt/PendingOrDoneFilter';

interface Task {
  id: string;
  user_id: number;
  link: string;
  title: string;
  start_time: string;
  status: string;
  card_id: number;
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
  const [tasks, setTasks] = useState<Task[]>([]); // 定义 tasks 状态
  const [filters, setFilters] = useState<string[]>([]); // 定义 filters 状态

  useEffect(() => {
    const fetchTasks = async () => {
      const supabase = await getDb();
      let query = supabase.from('task').select('*');

      if (filters.length > 0) {
        query = query.in('status', filters);
      } else {
        setTasks([]); // 如果不选择任何过滤器，设置 tasks 为空数组
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
              status={task.status} // 传递 status prop
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MakeRequest;
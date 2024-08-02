import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // 导入 Link 组件
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import TaskCard from "@/components/requestmgmt/TaskCard";

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

  useEffect(() => {
    const fetchTasks = async () => {
      const supabase = await getDb();
      const { data, error } = await supabase
        .from('task')
        .select('*').eq('status', 'pending');

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data as Task[]);
      }
    };

    fetchTasks();
  }, []);

  return (
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
          />
        ))}
      </div>
    </section>
  );
};

export default MakeRequest;
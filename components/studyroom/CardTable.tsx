// components/CardsTable.tsx
import React, { useState, useEffect } from 'react';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { Card } from '@/types/Card';
import Link from 'next/link';

const CardsTable: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      const supabase = await getDb();
      const { data, error } = await supabase
        .from('cards')
        .select('*');

      if (error) {
        console.error('Error fetching cards:', error);
      } else {
        setCards(data as Card[]);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Link</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Lang</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">WordCount</th>


            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cards.map(card => (
            <tr key={card.id}>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{card.generatedtitle}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{card.link}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{card.lang}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{card.wordcount}</td>


              <td className="whitespace-nowrap px-4 py-2">
                <Link href={`/studyroom/viewcard/${card.id}`} legacyBehavior>
                  <a className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                    View
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardsTable;
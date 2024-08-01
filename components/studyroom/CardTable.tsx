// components/CardsTable.tsx
import React, { useState, useEffect } from 'react';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { Card } from '@/types/Card';

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
    <div>
      <table className="min-w-full bg-white text-black border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Link</th>
            <th className="py-2 px-4 border-b">Original</th>
            <th className="py-2 px-4 border-b">Translate</th>
            <th className="py-2 px-4 border-b">Key Words</th>
            <th className="py-2 px-4 border-b">Key Grammer</th>
            <th className="py-2 px-4 border-b">Rewrite Article</th>
            <th className="py-2 px-4 border-b">Questions</th>
            <th className="py-2 px-4 border-b">Export Notes</th>
            <th className="py-2 px-4 border-b">Likes</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card.id}>
              <td className="py-2 px-4 border-b">{card.userid}</td>
              <td className="py-2 px-4 border-b">{card.link}</td>
              <td className="py-2 px-4 border-b">{card.original}</td>
              <td className="py-2 px-4 border-b">{card.translation}</td>
              <td className="py-2 px-4 border-b">{card.keywords}</td>
              <td className="py-2 px-4 border-b">{card.keygrammer}</td>
              <td className="py-2 px-4 border-b">{card.rewritedarticle}</td>
              <td className="py-2 px-4 border-b">{card.questions}</td>
              <td className="py-2 px-4 border-b">{card.notes}</td>
              <td className="py-2 px-4 border-b">{card.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardsTable;
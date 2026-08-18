'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, QrCode, Edit, Trash2, Eye } from 'lucide-react';
import { cardsAPI, Card } from '@/lib/api';

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await cardsAPI.getAll();
      setCards(res.data);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    try {
      await cardsAPI.delete(id);
      setCards(cards.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AR Cards</h1>
          <p className="text-gray-500 mt-1">Manage your AR experiences</p>
        </div>
        <Link
          href="/admin/cards/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Card
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <QrCode size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No cards yet</h3>
          <p className="text-gray-500 mt-2">Create your first AR card to get started</p>
          <Link
            href="/admin/cards/new"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Create Card
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden card-hover"
            >
              <div className="h-40 bg-gray-100 relative">
                {card.markerImage ? (
                  <img
                    src={card.markerImage}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <QrCode size={40} className="text-gray-300" />
                  </div>
                )}
                {!card.isActive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Inactive
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {card.description || 'No description'}
                </p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>Scans: {card.scanCount}</span>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Link
                    href={`/admin/cards/${card.id}`}
                    className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                  <Link
                    href={`/admin/cards/${card.id}/qr`}
                    className="flex-1 flex items-center justify-center gap-1 text-green-600 hover:bg-green-50 py-2 rounded-lg transition"
                  >
                    <QrCode size={16} />
                    QR
                  </Link>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

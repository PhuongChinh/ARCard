'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { cardsAPI, Card } from '@/lib/api';

export default function QRPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCard();
  }, [cardId]);

  const fetchCard = async () => {
    try {
      const res = await cardsAPI.getById(cardId);
      setCard(res.data);
    } catch (err) {
      console.error('Failed to fetch card:', err);
      router.push('/admin/cards');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!card?.qrCode) return;
    const link = document.createElement('a');
    link.download = `arcard-${card.id}.png`;
    link.href = card.qrCode;
    link.click();
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const arUrl = `${appUrl}/ar?id=${cardId}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/cards"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Code</h1>
          <p className="text-gray-500 mt-1">{card.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          {card.qrCode ? (
            <img
              src={card.qrCode}
              alt="QR Code"
              className="mx-auto w-64 h-64 object-contain"
            />
          ) : (
            <div className="w-64 h-64 mx-auto bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No QR Code</span>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">Scan to view AR experience</p>
          <p className="text-xs text-gray-400 break-all">{arUrl}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadQR}
            disabled={!card.qrCode}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Download size={20} />
            Download QR
          </button>
          <a
            href={arUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <ExternalLink size={20} />
            Open
          </a>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-blue-900 mb-2">How to use</h3>
        <ol className="text-sm text-blue-800 space-y-2">
          <li>1. Download the QR code or take a screenshot</li>
          <li>2. Print the QR code on your card or material</li>
          <li>3. Users scan the QR code with their phone camera</li>
          <li>4. The AR experience in will open the browser</li>
        </ol>
      </div>
    </div>
  );
}

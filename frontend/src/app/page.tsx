'use client';

import Link from 'next/link';
import { QrCode, Box, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ARCard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create augmented reality experiences with QR codes. 
            Share interactive 3D content with anyone, anywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">QR Code Generation</h3>
            <p className="text-gray-600">
              Generate unique QR codes for each AR card. Easy to print and share.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Box className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">3D Models</h3>
            <p className="text-gray-600">
              Upload GLB/GLTF models and display them in augmented reality.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Works on any modern browser. No app installation required.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

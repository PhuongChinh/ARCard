'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { cardsAPI, uploadAPI, Card, CreateCardData } from '@/lib/api';

export default function CardFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params.id !== 'new';
  const cardId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [formData, setFormData] = useState<CreateCardData>({
    title: '',
    description: '',
    markerImage: '',
    targetModel: '',
    modelScale: 1.0,
    zoomLimit: 2.0,
    isActive: true,
  });

  useEffect(() => {
    if (isEdit && cardId) {
      fetchCard();
    }
  }, [cardId, isEdit]);

  const fetchCard = async () => {
    try {
      const res = await cardsAPI.getById(cardId);
      const card: Card = res.data;
      setFormData({
        title: card.title,
        description: card.description || '',
        markerImage: card.markerImage,
        targetModel: card.targetModel,
        modelScale: card.modelScale,
        zoomLimit: card.zoomLimit,
        isActive: card.isActive,
      });
    } catch (err) {
      console.error('Failed to fetch card:', err);
      router.push('/admin/cards');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await cardsAPI.update(cardId, formData);
      } else {
        await cardsAPI.create(formData);
      }
      router.push('/admin/cards');
    } catch (err) {
      console.error('Failed to save card:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, type: 'model' | 'marker') => {
    const api = type === 'model' ? uploadAPI.uploadModel : uploadAPI.uploadMarker;
    try {
      console.log('Uploading file:', file.name, file.size);
      const res = await api(file);
      console.log('Upload response:', res.data);
      const url = res.data.url;
      setFormData((prev) => ({
        ...prev,
        [type === 'model' ? 'targetModel' : 'markerImage']: url,
      }));
    } catch (err: any) {
      console.error('Upload failed:', err.response?.data || err.message);
      alert('Failed to upload file: ' + (err.response?.data?.message || err.message));
    }
  };

  const ModelDropzone = () => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: { 'model/gltf-binary': ['.glb'], 'model/gltf+json': ['.gltf'] },
      maxSize: 10 * 1024 * 1024,
      onDrop: (files) => files[0] && uploadFile(files[0], 'model'),
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
        <p className="text-sm text-gray-600">
          {formData.targetModel ? 'Click to replace 3D model' : 'Drag & drop 3D model (.glb, .gltf)'}
        </p>
        <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
        {formData.targetModel && (
          <p className="text-green-600 text-sm mt-2">Model uploaded!</p>
        )}
      </div>
    );
  };

  const MarkerDropzone = () => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: { 'application/octet-stream': ['.mind'], 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
      maxSize: 5 * 1024 * 1024,
      onDrop: (files) => files[0] && uploadFile(files[0], 'marker'),
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
        <p className="text-sm text-gray-600">
          {formData.markerImage ? 'Click to replace AR target' : 'Drag & drop MindAR target (.mind)'}
        </p>
        <p className="text-xs text-gray-400 mt-1">Compile the marker image with MindAR, then upload its .mind file (max 5MB)</p>
        {formData.markerImage && (
          <p className="text-green-600 text-sm mt-2">Marker uploaded!</p>
        )}
      </div>
    );
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Card' : 'Create Card'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? 'Update AR card details' : 'Create a new AR experience'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3D Model *
            </label>
            <ModelDropzone />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MindAR Target *
            </label>
            <MarkerDropzone />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model Scale
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={formData.modelScale}
                onChange={(e) =>
                  setFormData({ ...formData, modelScale: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zoom Limit
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="5"
                value={formData.zoomLimit}
                onChange={(e) =>
                  setFormData({ ...formData, zoomLimit: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link
              href="/admin/cards"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Card'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

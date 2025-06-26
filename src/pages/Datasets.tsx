import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, FileText, Calendar, BarChart3, Eye, Trash2 } from 'lucide-react';
import { useDataStore } from '../store/dataStore';

export function Datasets() {
  const { datasets } = useDataStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Datasets</h1>
              <p className="text-gray-400 text-lg">
                Manage your uploaded datasets and trained models
              </p>
            </div>
            <Link
              to="/upload"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Database className="h-5 w-5" />
              <span>Upload Dataset</span>
            </Link>
          </div>
        </motion.div>

        {datasets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center"
          >
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No datasets yet</h3>
            <p className="text-gray-400 mb-6">
              Upload your first CSV file to start building machine learning models
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Database className="h-5 w-5" />
              <span>Upload Dataset</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {datasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{dataset.name}</h3>
                      <p className="text-gray-400 text-sm">{dataset.filename}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(dataset.status)}`}>
                    {dataset.status}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Size</span>
                    <span className="text-white">{formatFileSize(dataset.size)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Rows</span>
                    <span className="text-white">{dataset.rows.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Columns</span>
                    <span className="text-white">{dataset.columns}</span>
                  </div>
                  {dataset.modelType && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Model Type</span>
                      <span className="text-white capitalize">{dataset.modelType}</span>
                    </div>
                  )}
                  {dataset.accuracy && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Accuracy</span>
                      <span className="text-green-400 font-medium">{dataset.accuracy}%</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Uploaded</span>
                    <span className="text-white">
                      {new Date(dataset.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {dataset.status === 'ready' && (
                    <Link
                      to={`/analytics/${dataset.id}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-all border border-purple-500/20"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>View Analytics</span>
                    </Link>
                  )}
                  <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
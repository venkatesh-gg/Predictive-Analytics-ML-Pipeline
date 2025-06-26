import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Target, BarChart3, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { useDataStore } from '../store/dataStore';

export function Analytics() {
  const { id } = useParams<{ id: string }>();
  const { datasets } = useDataStore();
  const [dataset, setDataset] = useState(datasets.find(d => d.id === id));

  // Mock analytics data
  const [analyticsData] = useState({
    trainingProgress: [
      { epoch: 1, loss: 0.8, accuracy: 45 },
      { epoch: 2, loss: 0.6, accuracy: 62 },
      { epoch: 3, loss: 0.4, accuracy: 74 },
      { epoch: 4, loss: 0.3, accuracy: 82 },
      { epoch: 5, loss: 0.2, accuracy: 89 },
    ],
    featureImportance: [
      { feature: 'Feature A', importance: 0.35 },
      { feature: 'Feature B', importance: 0.28 },
      { feature: 'Feature C', importance: 0.19 },
      { feature: 'Feature D', importance: 0.12 },
      { feature: 'Feature E', importance: 0.06 },
    ],
    predictions: [
      { actual: 23, predicted: 24.5 },
      { actual: 45, predicted: 43.2 },
      { actual: 67, predicted: 68.1 },
      { actual: 32, predicted: 31.8 },
      { actual: 89, predicted: 87.3 },
    ],
  });

  if (!dataset) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Dataset not found</h2>
          <Link to="/datasets" className="text-purple-400 hover:text-purple-300">
            ← Back to Datasets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/datasets"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Datasets</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">{dataset.name}</h1>
          <p className="text-gray-400 text-lg">
            Model analytics and performance metrics
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-green-400">{dataset.accuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Model Type</p>
                <p className="text-2xl font-bold text-blue-400 capitalize">{dataset.modelType}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Training Time</p>
                <p className="text-2xl font-bold text-purple-400">2.3s</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Data Points</p>
                <p className="text-2xl font-bold text-orange-400">{dataset.rows.toLocaleString()}</p>
              </div>
              <Download className="h-8 w-8 text-orange-400" />
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Training Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-6">Training Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.trainingProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="epoch" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Feature Importance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-6">Feature Importance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.featureImportance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="feature" type="category" stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="importance" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Predictions vs Actual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 lg:col-span-2"
          >
            <h3 className="text-xl font-bold text-white mb-6">Predictions vs Actual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={analyticsData.predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="actual" name="Actual" stroke="#9CA3AF" />
                <YAxis dataKey="predicted" name="Predicted" stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Scatter dataKey="predicted" fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
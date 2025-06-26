import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Database, TrendingUp, Brain, BarChart3, FileText } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';

export function Dashboard() {
  const { datasets, predictions } = useDataStore();
  const { user } = useAuthStore();

  const stats = [
    {
      name: 'Total Datasets',
      value: datasets.length,
      icon: Database,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      name: 'Trained Models',
      value: datasets.filter((d) => d.status === 'ready').length,
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      name: 'Predictions Made',
      value: predictions.length,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      name: 'Avg Accuracy',
      value: datasets.length > 0 
        ? `${Math.round(datasets.filter(d => d.accuracy).reduce((acc, d) => acc + (d.accuracy || 0), 0) / datasets.filter(d => d.accuracy).length || 0)}%`
        : '0%',
      icon: BarChart3,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your machine learning datasets and models
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/upload"
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 transition-all border border-purple-500/20"
              >
                <Upload className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="text-white font-semibold">Upload Dataset</h3>
                  <p className="text-gray-400 text-sm">Upload a CSV file to start analysis</p>
                </div>
              </Link>
              <Link
                to="/datasets"
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-lg hover:from-blue-600/30 hover:to-teal-600/30 transition-all border border-blue-500/20"
              >
                <Database className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-white font-semibold">View Datasets</h3>
                  <p className="text-gray-400 text-sm">Manage your uploaded datasets</p>
                </div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {datasets.slice(0, 3).map((dataset) => (
                <div
                  key={dataset.id}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                >
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{dataset.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {dataset.rows} rows • {dataset.columns} columns
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    dataset.status === 'ready' 
                      ? 'bg-green-500/20 text-green-400'
                      : dataset.status === 'processing'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {dataset.status}
                  </div>
                </div>
              ))}
              {datasets.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No datasets uploaded yet</p>
                  <Link
                    to="/upload"
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Upload your first dataset
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
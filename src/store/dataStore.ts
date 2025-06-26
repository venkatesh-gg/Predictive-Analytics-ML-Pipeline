import { create } from 'zustand';

interface Dataset {
  id: string;
  name: string;
  filename: string;
  size: number;
  columns: number;
  rows: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'error';
  modelType?: 'classification' | 'regression';
  accuracy?: number;
}

interface Prediction {
  id: string;
  datasetId: string;
  predictions: number[];
  confidence: number[];
  createdAt: string;
}

interface DataState {
  datasets: Dataset[];
  predictions: Prediction[];
  currentDataset: Dataset | null;
  addDataset: (dataset: Dataset) => void;
  updateDataset: (id: string, updates: Partial<Dataset>) => void;
  setCurrentDataset: (dataset: Dataset | null) => void;
  addPrediction: (prediction: Prediction) => void;
}

export const useDataStore = create<DataState>((set) => ({
  datasets: [],
  predictions: [],
  currentDataset: null,
  addDataset: (dataset) =>
    set((state) => ({ datasets: [...state.datasets, dataset] })),
  updateDataset: (id, updates) =>
    set((state) => ({
      datasets: state.datasets.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  setCurrentDataset: (dataset) => set({ currentDataset: dataset }),
  addPrediction: (prediction) =>
    set((state) => ({ predictions: [...state.predictions, prediction] })),
}));
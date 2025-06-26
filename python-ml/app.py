from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC, SVR
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score, classification_report
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pickle
import os
import io

app = Flask(__name__)

class MLPipeline:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.model_type = None
        self.feature_names = []
        
    def determine_model_type(self, y):
        """Determine if this is a classification or regression problem"""
        if y.dtype == 'object' or len(np.unique(y)) < 10:
            return 'classification'
        else:
            return 'regression'
    
    def preprocess_data(self, df):
        """Clean and preprocess the dataset"""
        # Remove empty columns and rows
        df = df.dropna(axis=1, how='all')
        df = df.dropna(axis=0, how='any')
        
        # Convert categorical columns to numeric
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_numeric(df[col])
                except ValueError:
                    # If conversion fails, use label encoding
                    le = LabelEncoder()
                    df[col] = le.fit_transform(df[col].astype(str))
        
        return df
    
    def select_model(self, model_type, X_train, y_train):
        """Select the best model based on the data characteristics"""
        models = {}
        
        if model_type == 'classification':
            models = {
                'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                'logistic_regression': LogisticRegression(random_state=42),
                'svm': SVC(random_state=42)
            }
        else:
            models = {
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                'linear_regression': LinearRegression(),
                'svm': SVR()
            }
        
        best_model = None
        best_score = -float('inf')
        
        # Simple model selection based on data size
        if len(X_train) < 1000:
            best_model = models['random_forest']
        elif len(X_train) < 10000:
            best_model = models.get('logistic_regression' if model_type == 'classification' else 'linear_regression')
        else:
            best_model = models['svm']
        
        return best_model
    
    def train(self, csv_data):
        """Train the ML model on the provided CSV data"""
        try:
            # Read CSV data
            df = pd.read_csv(io.StringIO(csv_data))
            
            # Preprocess data
            df = self.preprocess_data(df)
            
            if len(df) < 10:
                raise ValueError("Dataset too small for training")
            
            # Assume last column is the target
            X = df.iloc[:, :-1]
            y = df.iloc[:, -1]
            
            self.feature_names = X.columns.tolist()
            
            # Determine model type
            self.model_type = self.determine_model_type(y)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Encode labels if classification
            if self.model_type == 'classification':
                y = self.label_encoder.fit_transform(y)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42
            )
            
            # Select and train model
            self.model = self.select_model(self.model_type, X_train, y_train)
            self.model.fit(X_train, y_train)
            
            # Make predictions
            y_pred = self.model.predict(X_test)
            
            # Calculate metrics
            if self.model_type == 'classification':
                accuracy = accuracy_score(y_test, y_pred)
                metrics = {
                    'accuracy': float(accuracy),
                    'model_type': self.model_type,
                    'features': self.feature_names,
                    'n_samples': len(df),
                    'n_features': len(self.feature_names)
                }
            else:
                mse = mean_squared_error(y_test, y_pred)
                r2 = r2_score(y_test, y_pred)
                accuracy = max(0, r2) * 100  # Convert R² to percentage
                metrics = {
                    'accuracy': float(accuracy),
                    'mse': float(mse),
                    'r2': float(r2),
                    'model_type': self.model_type,
                    'features': self.feature_names,
                    'n_samples': len(df),
                    'n_features': len(self.feature_names)
                }
            
            return metrics
            
        except Exception as e:
            raise Exception(f"Training failed: {str(e)}")
    
    def predict(self, data):
        """Make predictions on new data"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        try:
            # Convert to DataFrame if needed
            if isinstance(data, list):
                data = pd.DataFrame([data], columns=self.feature_names)
            
            # Scale features
            data_scaled = self.scaler.transform(data)
            
            # Make predictions
            predictions = self.model.predict(data_scaled)
            
            # Convert back to original labels if classification
            if self.model_type == 'classification':
                predictions = self.label_encoder.inverse_transform(predictions)
            
            return predictions.tolist()
            
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")

# Global pipeline instance
pipeline = MLPipeline()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ML Pipeline'})

@app.route('/train', methods=['POST'])
def train_model():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read CSV content
        csv_content = file.read().decode('utf-8')
        
        # Train model
        metrics = pipeline.train(csv_content)
        
        return jsonify({
            'message': 'Model trained successfully',
            'metrics': metrics
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def make_prediction():
    try:
        data = request.get_json()
        
        if 'features' not in data:
            return jsonify({'error': 'No features provided'}), 400
        
        predictions = pipeline.predict(data['features'])
        
        return jsonify({
            'predictions': predictions,
            'model_type': pipeline.model_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/model-info', methods=['GET'])
def get_model_info():
    if pipeline.model is None:
        return jsonify({'error': 'No model trained'}), 400
    
    return jsonify({
        'model_type': pipeline.model_type,
        'features': pipeline.feature_names,
        'model_class': pipeline.model.__class__.__name__
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
# ML Analytics Pipeline

A comprehensive full-stack machine learning platform for predictive analytics with automatic model selection and training.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **Dataset Upload**: Drag-and-drop CSV file upload with validation
- **Automatic ML Pipeline**: Intelligent model selection (classification/regression)
- **Real-time Analytics**: Interactive dashboards with charts and metrics
- **Model Training**: Automated training with accuracy reporting
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Microservices Architecture**: Containerized services with Docker
- **Responsive Design**: Beautiful UI that works on all devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  Python ML      │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   Service       │
│   Port: 5173    │    │   Port: 3001    │    │   (Flask)       │
└─────────────────┘    └─────────────────┘    │   Port: 5000    │
                                              └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Hook Form** for form handling
- **Zustand** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** database
- **JWT** authentication
- **Multer** for file uploads
- **Swagger** API documentation

### ML Service
- **Python 3.11** with Flask
- **Scikit-learn** for ML models
- **Pandas** for data processing
- **NumPy** for numerical computing

### DevOps
- **Docker** containerization
- **Docker Compose** orchestration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ml-analytics-pipeline
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   cd ..
   
   # Python dependencies
   cd python-ml
   pip install -r requirements.txt
   cd ..
   ```

3. **Start the services**
   ```bash
   # Option 1: Using npm scripts
   npm run dev  # Starts both frontend and backend
   
   # In a separate terminal, start Python ML service
   cd python-ml
   python app.py
   ```

   ```bash
   # Option 2: Using Docker
   npm run docker:up
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Python ML Service: http://localhost:5000
   - API Documentation: http://localhost:3001/api-docs

## 📊 Usage

### 1. User Registration & Login
- Create an account or sign in with existing credentials
- JWT tokens provide secure session management

### 2. Dataset Upload
- Drag and drop CSV files (max 50MB)
- Automatic validation and preprocessing
- Real-time upload progress

### 3. Model Training
- Automatic model type detection (classification/regression)
- Intelligent algorithm selection based on data characteristics
- Training progress and accuracy metrics

### 4. Analytics Dashboard
- Interactive charts showing training progress
- Feature importance visualization
- Prediction vs actual value comparisons
- Model performance metrics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Datasets
- `POST /api/datasets/upload` - Upload dataset
- `GET /api/datasets` - List user datasets
- `GET /api/datasets/:id` - Get specific dataset

### ML Service
- `POST /train` - Train model on dataset
- `POST /predict` - Make predictions
- `GET /model-info` - Get model information

## 🐳 Docker Deployment

The application is fully containerized and can be deployed using Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]
```

## 📋 Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
PORT=3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_ML_API_URL=http://localhost:5000
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- CORS protection
- SQL injection prevention
- Input sanitization

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Python tests
cd python-ml
python -m pytest
```

## 📈 Performance Optimizations

- Lazy loading of components
- Efficient state management
- Database indexing
- File upload progress tracking
- Responsive image loading
- Code splitting

## 🔄 CI/CD Pipeline

The project is configured for continuous integration and deployment:

1. **Code Quality**: ESLint, Prettier, TypeScript checks
2. **Testing**: Unit tests, integration tests
3. **Building**: Optimized production builds
4. **Deployment**: Docker containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:
- Open an issue on GitHub
- Check the API documentation at `/api-docs`
- Review the troubleshooting guide below

## 🐛 Troubleshooting

### Common Issues

1. **Upload fails**: Check file size (max 50MB) and format (CSV only)
2. **Training errors**: Ensure dataset has numeric columns and sufficient rows
3. **Connection errors**: Verify all services are running on correct ports
4. **Docker issues**: Check Docker daemon is running and ports are available

### Debug Mode

Enable debug logging:
```bash
# Backend
DEBUG=* npm run dev:backend

# Python ML Service
FLASK_DEBUG=1 python app.py
```

## 🚀 Future Enhancements

- [ ] Advanced model tuning and hyperparameter optimization
- [ ] Support for more file formats (JSON, Excel)
- [ ] Real-time collaboration features  
- [ ] Advanced data visualization options
- [ ] Model deployment and serving
- [ ] A/B testing for models
- [ ] Data pipeline automation
- [ ] Integration with cloud ML services

---

Built with ❤️ using modern web technologies and machine learning best practices.
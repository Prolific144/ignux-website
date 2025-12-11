// src/components/Shared/ErrorBoundary.jsx
import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import CTAButton from './CTAButton';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <AlertTriangle className="error-icon" />
            <h1>Something went wrong</h1>
            <p>We're having trouble loading this page. Please try again.</p>
            <div className="error-actions">
              <CTAButton
                text="Go Home"
                variant="primary"
                onClick={() => window.location.href = '/'}
              />
              <button 
                className="refresh-button"
                onClick={this.handleReset}
              >
                <RefreshCw size={20} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
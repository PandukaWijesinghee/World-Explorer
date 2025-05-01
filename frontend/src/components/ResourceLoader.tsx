import React, { useEffect, useState } from 'react';
import { loadResource, isResourceBlocked } from '../utils/resourceLoader';

interface ResourceLoaderProps {
  children: React.ReactNode;
}


const ResourceLoader: React.FC<ResourceLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeResources = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        // List of resources to check and load
        const resources = [
          {
            url: 'https://restcountries.com/v3.1/all',
            type: 'script' as const,
            fallback: '/api/all' // Local fallback
          }
        ];

        // Check each resource
        for (const resource of resources) {
          const isBlocked = await isResourceBlocked(resource.url);
          if (isBlocked) {
            console.warn(`Resource ${resource.url} is blocked, using fallback`);
            // If blocked, try to load from fallback
            await loadResource(resource.fallback, undefined, resource.type);
          } else {
            // If not blocked, load from primary URL
            await loadResource(resource.url, resource.fallback, resource.type);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing resources:', err);
        setError('Failed to load some resources. The application may not work correctly.');
        setIsLoading(false);
      }
    };

    initializeResources();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-400">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 max-w-md">
          <strong className="font-bold">Warning: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ResourceLoader; 
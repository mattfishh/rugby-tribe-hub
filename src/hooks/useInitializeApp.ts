
import { useEffect, useState } from 'react';
import { seedDatabase } from '@/utils/seedDatabase';

export function useInitializeApp() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        setIsLoading(true);
        await seedDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  return { isInitialized, isLoading };
}

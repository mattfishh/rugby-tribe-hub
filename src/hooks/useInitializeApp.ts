import { useEffect, useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useInitializeApp() {
  const [isLoading, setIsLoading] = useState(true);
  const teams = useQuery(api.teams.getAll);
  const seed = useMutation(api.seed.seedDatabase);

  useEffect(() => {
    if (teams === undefined) return;

    if (teams.length === 0) {
      seed()
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error seeding database:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [teams, seed]);

  return { isInitialized: !isLoading, isLoading };
}

import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchData(endpoint)
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
}

import { useCallback, useState } from 'react';

const stateMachine = {
  pending: 'pending',
  load: 'load',
  success: 'success',
  rejected: 'rejected',
};

export const useHttp = () => {
  const [state, setState] = useState(stateMachine.pending);
  const [error, setError] = useState(null);

  const getData = useCallback(async url => {
    setState(stateMachine.load);
    try {
      const resp = await fetch(url);
      const { data } = await resp.json();
      setState(stateMachine.success);
      return data;
    } catch (error) {
      setError(error);
      setState(stateMachine.rejected);
    }
  }, []);

  return { state, getData, error };
};

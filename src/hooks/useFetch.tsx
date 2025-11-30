import { useCallback, useEffect, useRef, useState } from 'react';
import { http, HttpError, isHttpError } from 'tosslib';

type METHODS = 'get' | 'post' | 'patch' | 'put' | 'delete';

export const useFetch = <D, M extends METHODS = METHODS>(
  method: M,
  url: string,
  { fetchOnMount = true, ...options }: Parameters<(typeof http)[M]>[1] & { fetchOnMount?: boolean } = {}
) => {
  const [data, setData] = useState<D | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HttpError | string | null>(null);
  //   const abortController = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const httpOptions = useRef<Parameters<(typeof http)[M]>[1]>(options);
  const mounted = useRef(false);

  useEffect(() => {
    httpOptions.current = options;
  }, [options]);

  const executeFetch = useCallback(
    async (options?: Parameters<(typeof http)[M]>[1]) => {
      try {
        setError(null);
        setLoading(true);
        //   if (abortController.current) {
        //     abortController.current.abort();
        //   }
        //   const controller = new AbortController();
        //   abortController.current = controller;

        const currentRequestId = ++requestId.current;

        const data = await http[method]<D>(url, { ...httpOptions.current, ...options });

        if (requestId.current > currentRequestId) {
          return;
        }

        //   if (controller.signal.aborted) {
        //     return;
        //   }

        setData(data);
      } catch (error) {
        if (isHttpError(error)) {
          setError(error);
          return;
        }
        setError('Unknown Error');
      } finally {
        setLoading(false);
      }
    },
    [method, url]
  );

  useEffect(() => {
    if (mounted.current) {
      return;
    }

    if (fetchOnMount) {
      executeFetch();
    }
    mounted.current = true;
  }, [fetchOnMount, executeFetch]);

  return {
    executeFetch: useCallback(
      async (options?: Parameters<(typeof http)[M]>[1]) => {
        try {
          setError(null);
          setLoading(true);
          //   if (abortController.current) {
          //     abortController.current.abort();
          //   }
          //   const controller = new AbortController();
          //   abortController.current = controller;

          const currentRequestId = ++requestId.current;

          const data = await http[method]<D>(url, { ...httpOptions.current, ...options });

          if (requestId.current > currentRequestId) {
            return;
          }

          //   if (controller.signal.aborted) {
          //     return;
          //   }

          setData(data);
        } catch (error) {
          if (isHttpError(error)) {
            setError(error);
            return;
          }
          setError('Unknown Error');
        } finally {
          setLoading(false);
        }
      },
      [method, url]
    ),
    data,
    loading,
    error,
  };
};

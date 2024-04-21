import { useState } from 'react';
import axios from 'axios';

const useSeparateSong = () => {
  const [isSeparateLoading, setIsLoading] = useState(false);
  const [isSeparateSuccess, setSuccess] = useState(false);
  const [separateError, setError] = useState(null);

  const separateSong = async (songId) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send request to separate song endpoint
      const response = await axios.post(`http://127.0.0.1:5000/separate/${songId}`);
      // Handle response data if needed
      setSuccess(true);
    } catch (error) {
      // Handle error
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { separateSong, isSeparateLoading, isSeparateSuccess, separateError };
};

export default useSeparateSong;

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export function useSupports(projectId) {
  const [supports, setSupports] = useState([]);
  const [supportCount, setSupportCount] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUserId = pb.authStore.model?.id;

  useEffect(() => {
    if (projectId) {
      fetchSupports();
    }
  }, [projectId]);

  const fetchSupports = async () => {
    try {
      setLoading(true);
      const allSupports = await pb.collection('supports').getFullList({
        filter: `project_id = "${projectId}"`,
        $autoCancel: false
      });
      setSupports(allSupports);
      setSupportCount(allSupports.length);
      
      if (currentUserId) {
        const userSupport = allSupports.find(support => support.user_id === currentUserId);
        setIsSupported(!!userSupport);
      }
    } catch (error) {
      console.error('Error fetching supports:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSupport = async () => {
    if (!currentUserId) {
      throw new Error('Must be logged in to support');
    }

    try {
      await pb.collection('supports').create({
        user_id: currentUserId,
        project_id: projectId
      }, { $autoCancel: false });
      
      setIsSupported(true);
      setSupportCount(prev => prev + 1);
    } catch (error) {
      console.error('Error adding support:', error);
      throw error;
    }
  };

  const removeSupport = async () => {
    if (!currentUserId) {
      throw new Error('Must be logged in to remove support');
    }

    try {
      const userSupport = supports.find(support => support.user_id === currentUserId);
      if (userSupport) {
        await pb.collection('supports').delete(userSupport.id, { $autoCancel: false });
        setIsSupported(false);
        setSupportCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error removing support:', error);
      throw error;
    }
  };

  const toggleSupport = async () => {
    if (isSupported) {
      await removeSupport();
    } else {
      await addSupport();
    }
  };

  return {
    supports,
    supportCount,
    isSupported,
    loading,
    addSupport,
    removeSupport,
    toggleSupport
  };
}
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export function useLikes(projectId) {
  const [likes, setLikes] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUserId = pb.authStore.model?.id;

  useEffect(() => {
    if (projectId) {
      fetchLikes();
    }
  }, [projectId]);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const allLikes = await pb.collection('likes').getFullList({
        filter: `project_id = "${projectId}"`,
        $autoCancel: false
      });
      setLikes(allLikes);
      setLikeCount(allLikes.length);
      
      if (currentUserId) {
        const userLike = allLikes.find(like => like.user_id === currentUserId);
        setIsLiked(!!userLike);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLike = async () => {
    if (!currentUserId) {
      throw new Error('Must be logged in to like');
    }

    try {
      await pb.collection('likes').create({
        user_id: currentUserId,
        project_id: projectId
      }, { $autoCancel: false });
      
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  };

  const removeLike = async () => {
    if (!currentUserId) {
      throw new Error('Must be logged in to unlike');
    }

    try {
      const userLike = likes.find(like => like.user_id === currentUserId);
      if (userLike) {
        await pb.collection('likes').delete(userLike.id, { $autoCancel: false });
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  };

  const toggleLike = async () => {
    if (isLiked) {
      await removeLike();
    } else {
      await addLike();
    }
  };

  return {
    likes,
    likeCount,
    isLiked,
    loading,
    addLike,
    removeLike,
    toggleLike
  };
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, FolderHeart as HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import UserAvatar from '@/components/UserAvatar.jsx';
import ReputationBadge from '@/components/ReputationBadge.jsx';
import { useLikes } from '@/hooks/useLikes.js';
import { useSupports } from '@/hooks/useSupports.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function ProjectCard({ project, creator }) {
  const { isAuthenticated } = useAuth();
  const { likeCount, isLiked, toggleLike } = useLikes(project.id);
  const { supportCount, isSupported, toggleSupport } = useSupports(project.id);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Inicia sesión para dar me gusta a los proyectos');
      return;
    }
    try {
      await toggleLike();
      toast.success(isLiked ? 'Me gusta eliminado' : 'Proyecto me gusta');
    } catch (error) {
      toast.error('Error al actualizar me gusta');
    }
  };

  const handleSupport = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Inicia sesión para apoyar proyectos');
      return;
    }
    try {
      await toggleSupport();
      toast.success(isSupported ? 'Apoyo eliminado' : 'Proyecto apoyado');
    } catch (error) {
      toast.error('Error al actualizar apoyo');
    }
  };

  const imageUrl = project.project_image 
    ? pb.files.getUrl(project, project.project_image)
    : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop';

  return (
    <div className="card-3d bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
      <Link to={`/profile/${project.creator_id}`}>
        <div className="aspect-video overflow-hidden">
          <img 
            src={imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-6">
        <Link to={`/profile/${project.creator_id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <UserAvatar user={creator} size="sm" />
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${project.creator_id}`} className="font-medium hover:text-primary transition-colors block truncate">
              {creator?.name || 'Creador Desconocido'}
            </Link>
            <ReputationBadge level={creator?.reputation_level || 0} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className="flex-1 transition-all duration-200"
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            <span>{likeCount}</span>
          </Button>
          
          <Button
            variant={isSupported ? "secondary" : "outline"}
            size="sm"
            onClick={handleSupport}
            className="flex-1 transition-all duration-200"
          >
            <HandHeart size={16} className={isSupported ? 'fill-current' : ''} />
            <span>{supportCount}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
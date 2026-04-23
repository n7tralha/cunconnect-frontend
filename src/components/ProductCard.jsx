import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import pb from '@/lib/pocketbaseClient.js';
import UserAvatar from '@/components/UserAvatar.jsx';
import ReputationBadge from '@/components/ReputationBadge.jsx';

export default function ProductCard({ product, seller }) {
  const imageUrl = product.product_image 
    ? pb.files.getUrl(product, product.product_image)
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop';

  return (
    <div className="card-3d bg-muted rounded-2xl overflow-hidden border border-border">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-bold mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-2xl font-bold text-primary mb-3">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
          <UserAvatar user={seller} size="sm" />
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${product.seller_id}`} className="text-sm font-medium hover:text-primary transition-colors block truncate">
              {seller?.name || 'Vendedor Desconocido'}
            </Link>
            <ReputationBadge level={seller?.reputation_level || 0} size="sm" />
          </div>
        </div>

        {product.contact_info && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={`mailto:${product.contact_info}`}>
              <Mail size={16} />
              Contactar al Vendedor
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
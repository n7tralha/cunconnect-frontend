import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import UserAvatar from '@/components/UserAvatar.jsx';
import ReputationBadge from '@/components/ReputationBadge.jsx';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await pb.collection('products').getOne(productId, { $autoCancel: false });
      setProduct(productData);

      const sellerData = await pb.collection('users').getOne(productData.seller_id, { $autoCancel: false });
      setSeller(sellerData);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-12 w-32 mb-6" />
              <Skeleton className="h-24 w-full mb-8" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button asChild>
            <Link to="/products">Volver a Productos</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = product.product_image 
    ? pb.files.getUrl(product, product.product_image)
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop';

  return (
    <>
      <Helmet>
        <title>{`${product.name} - CunConnects`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/products">
                <ArrowLeft size={16} />
                Volver a Productos
              </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                <img 
                  src={imageUrl} 
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </div>

              <div>
                <h1 className="text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
                  {product.name}
                </h1>

                <p className="text-4xl font-bold text-primary mb-6">
                  ${product.price.toFixed(2)}
                </p>

                <div className="bg-muted/50 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Categoría</p>
                  <p className="font-semibold">{product.category}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                  <h3 className="font-semibold mb-4">Información del Vendedor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar user={seller} size="md" />
                    <div className="flex-1">
                      <Link to={`/profile/${seller?.id}`} className="font-medium hover:text-primary transition-colors block">
                        {seller?.name || 'Vendedor Desconocido'}
                      </Link>
                      <ReputationBadge level={seller?.reputation_level || 0} size="sm" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/profile/${seller?.id}`}>
                      Ver Perfil del Vendedor
                    </Link>
                  </Button>
                </div>

                {product.contact_info && (
                  <Button size="lg" variant="secondary" className="w-full" asChild>
                    <a href={`mailto:${product.contact_info}`}>
                      <Mail size={20} />
                      Contactar al Vendedor
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
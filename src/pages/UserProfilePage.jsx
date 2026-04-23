import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import UserAvatar from '@/components/UserAvatar.jsx';
import ReputationBadge from '@/components/ReputationBadge.jsx';
import ProjectCard from '@/components/ProjectCard.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function UserProfilePage() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await pb.collection('users').getOne(userId, { $autoCancel: false });
      setUser(userData);

      const userProjects = await pb.collection('projects').getFullList({
        filter: `creator_id = "${userId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setProjects(userProjects);

      const userProducts = await pb.collection('products').getFullList({
        filter: `seller_id = "${userId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setProducts(userProducts);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="flex items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Usuario no encontrado</h1>
          <Button asChild>
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${user.name} - CunConnects`}</title>
        <meta name="description" content={`Ver el perfil, proyectos y productos de ${user.name} en CunConnects.`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-card rounded-2xl border border-border p-8 mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <UserAvatar user={user} size="xl" />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2" style={{letterSpacing: '-0.02em'}}>
                        {user.name}
                      </h1>
                      <ReputationBadge level={user.reputation_level || 0} size="lg" />
                    </div>
                    {isOwnProfile && (
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                        Editar Perfil
                      </Button>
                    )}
                  </div>

                  {user.bio && (
                    <p className="text-muted-foreground mb-4 leading-relaxed max-w-prose">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Puntos de Experiencia: </span>
                      <span className="font-semibold">{user.experience_points || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Proyectos: </span>
                      <span className="font-semibold">{projects.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Productos: </span>
                      <span className="font-semibold">{products.length}</span>
                    </div>
                  </div>

                  {user.contact_info && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${user.contact_info}`}>
                          <Mail size={16} />
                          Contacto
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="projects">Proyectos ({projects.length})</TabsTrigger>
                <TabsTrigger value="products">Productos ({products.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                {projects.length === 0 ? (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-2">Aún no hay proyectos</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? 'Comienza creando tu primer proyecto' : 'Este usuario aún no ha creado ningún proyecto'}
                    </p>
                    {isOwnProfile && (
                      <Button asChild className="mt-4">
                        <Link to="/create-project">Crear Proyecto</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} creator={user} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="products">
                {products.length === 0 ? (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-2">Aún no hay productos</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? 'Comienza agregando tu primer producto' : 'Este usuario aún no ha agregado ningún producto'}
                    </p>
                    {isOwnProfile && (
                      <Button asChild className="mt-4">
                        <Link to="/add-product">Agregar Producto</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} seller={user} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
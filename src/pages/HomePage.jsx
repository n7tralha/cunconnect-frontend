import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProjectCard from '@/components/ProjectCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [creators, setCreators] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsList = await pb.collection('projects').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      
      setProjects(projectsList);

      const creatorIds = [...new Set(projectsList.map(p => p.creator_id))];
      const creatorsData = {};
      
      for (const id of creatorIds) {
        try {
          const user = await pb.collection('users').getOne(id, { $autoCancel: false });
          creatorsData[id] = user;
        } catch (error) {
          console.error(`Error fetching creator ${id}:`, error);
        }
      }
      
      setCreators(creatorsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>CunConnects - Conecta, Crea, Colabora</title>
        <meta name="description" content="Únete a CunConnects para compartir tus proyectos emprendedores, descubrir productos innovadores y construir tu reputación en la comunidad." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1681184025442-1517cb9319c1" 
                alt="Emprendedores colaborando"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
                  <Sparkles size={16} />
                  <span className="text-sm font-medium">Donde los emprendedores se conectan</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{letterSpacing: '-0.02em'}}>
                  Comparte tu visión.
                  <br />
                  Construye tu reputación.
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                  CunConnects reúne a innovadores, creadores y emprendedores. Lanza proyectos, muestra productos y haz crecer tu red.
                </p>

                <div className="flex flex-wrap gap-4">
                  {isAuthenticated ? (
                    <>
                      <Button size="lg" asChild className="transition-all duration-200 active:scale-[0.98]">
                        <Link to="/create-project">
                          Lanzar un Proyecto
                          <ArrowRight size={20} />
                        </Link>
                      </Button>
                      <Button size="lg" variant="secondary" asChild className="transition-all duration-200 active:scale-[0.98]">
                        <Link to="/add-product">
                          Agregar un Producto
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="lg" asChild className="transition-all duration-200 active:scale-[0.98]">
                        <Link to="/signup">
                          Comenzar
                          <ArrowRight size={20} />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="transition-all duration-200 active:scale-[0.98]">
                        <Link to="/login">
                          Iniciar Sesión
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
                  Últimos proyectos
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Descubre lo que la comunidad está construyendo
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border p-6">
                      <Skeleton className="w-full aspect-video mb-4 rounded-xl" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="w-8 h-8 rounded-xl" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-16">
                  <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aún no hay proyectos</h3>
                  <p className="text-muted-foreground mb-6">Sé el primero en compartir tu proyecto con la comunidad</p>
                  {isAuthenticated && (
                    <Button asChild>
                      <Link to="/create-project">Crear Primer Proyecto</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProjectCard 
                        project={project} 
                        creator={creators[project.creator_id]}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
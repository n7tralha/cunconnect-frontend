import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function ProjectCreationPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    project_image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20971520) {
        setErrors(prev => ({ ...prev, project_image: 'La imagen debe ser menor a 20MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, project_image: file }));
      setImagePreview(URL.createObjectURL(file));
      if (errors.project_image) {
        setErrors(prev => ({ ...prev, project_image: '' }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es obligatoria';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const projectData = new FormData();
      projectData.append('title', formData.title);
      projectData.append('description', formData.description);
      projectData.append('category', formData.category);
      projectData.append('creator_id', currentUser.id);
      
      if (formData.project_image) {
        projectData.append('project_image', formData.project_image);
      }

      const record = await pb.collection('projects').create(projectData, { $autoCancel: false });
      
      toast.success('Proyecto creado con éxito');
      navigate(`/profile/${currentUser.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Crear Proyecto - CunConnects</title>
        <meta name="description" content="Comparte tu proyecto emprendedor con la comunidad de CunConnects." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
                Crear un proyecto
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Comparte tu visión emprendedora con la comunidad
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ingresa el título de tu proyecto"
                    className="mt-1.5 text-foreground"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="ej., Tecnología, Diseño, Marketing"
                    className="mt-1.5 text-foreground"
                  />
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe tu proyecto, sus objetivos y qué lo hace único"
                    rows={6}
                    className="mt-1.5 text-foreground"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="project_image">Imagen del Proyecto (opcional)</Label>
                  <div className="mt-1.5">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Vista previa" 
                          className="w-full aspect-video object-cover rounded-xl border border-border"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, project_image: null }));
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2"
                        >
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                        <Upload className="text-muted-foreground mb-2" size={32} />
                        <span className="text-sm text-muted-foreground">Haz clic para subir imagen</span>
                        <span className="text-xs text-muted-foreground mt-1">Máx 20MB</span>
                        <input
                          id="project_image"
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.project_image && (
                    <p className="text-sm text-destructive mt-1">{errors.project_image}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 transition-all duration-200 active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Crear Proyecto'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
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

export default function ProductUploadPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    contact_info: '',
    product_image: null
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
        setErrors(prev => ({ ...prev, product_image: 'La imagen debe ser menor a 20MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, product_image: file }));
      setImagePreview(URL.createObjectURL(file));
      if (errors.product_image) {
        setErrors(prev => ({ ...prev, product_image: '' }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    if (!formData.price) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'El precio debe ser un número válido';
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
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('category', formData.category);
      productData.append('seller_id', currentUser.id);
      
      if (formData.contact_info) {
        productData.append('contact_info', formData.contact_info);
      }
      
      if (formData.product_image) {
        productData.append('product_image', formData.product_image);
      }

      const record = await pb.collection('products').create(productData, { $autoCancel: false });
      
      toast.success('Producto agregado con éxito');
      navigate(`/products/${record.id}`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error al agregar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Agregar Producto - CunConnects</title>
        <meta name="description" content="Lista tu producto en el mercado de CunConnects." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
                Agregar un producto
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Lista tu producto y llega a clientes potenciales
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre del producto"
                    className="mt-1.5 text-foreground"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Precio ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="mt-1.5 text-foreground"
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive mt-1">{errors.price}</p>
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
                      placeholder="ej., Electrónica, Moda"
                      className="mt-1.5 text-foreground"
                    />
                    {errors.category && (
                      <p className="text-sm text-destructive mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe tu producto, sus características y beneficios"
                    rows={6}
                    className="mt-1.5 text-foreground"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact_info">Correo de Contacto (opcional)</Label>
                  <Input
                    id="contact_info"
                    name="contact_info"
                    type="email"
                    value={formData.contact_info}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    className="mt-1.5 text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="product_image">Imagen del Producto (opcional)</Label>
                  <div className="mt-1.5">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Vista previa" 
                          className="w-full aspect-square object-cover rounded-xl border border-border"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, product_image: null }));
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2"
                        >
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                        <Upload className="text-muted-foreground mb-2" size={32} />
                        <span className="text-sm text-muted-foreground">Haz clic para subir imagen</span>
                        <span className="text-xs text-muted-foreground mt-1">Máx 20MB</span>
                        <input
                          id="product_image"
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.product_image && (
                    <p className="text-sm text-destructive mt-1">{errors.product_image}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 transition-all duration-200 active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? 'Agregando...' : 'Agregar Producto'}
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
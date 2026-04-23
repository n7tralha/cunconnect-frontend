import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="text-primary" size={24} />
              <span className="font-bold text-lg text-foreground">CunConnects</span>
            </div>
            <p className="text-sm leading-relaxed max-w-prose">
              Conectando emprendedores, innovadores y creadores. Comparte tus proyectos, descubre productos y construye tu reputación en la comunidad.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/create-project" className="hover:text-primary transition-colors">
                  Crear Proyecto
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="hover:text-primary transition-colors">
                  Agregar Producto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Conectar</h3>
            <div className="flex gap-4 mb-4">
              <a href="mailto:hello@cunconnects.com" className="hover:text-primary transition-colors" aria-label="Correo Electrónico">
                <Mail size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
            <p className="text-sm">
              <a href="mailto:hello@cunconnects.com" className="hover:text-primary transition-colors">
                hello@cunconnects.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; 2026 CunConnects. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
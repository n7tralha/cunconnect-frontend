import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, LogOut, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import UserAvatar from '@/components/UserAvatar.jsx';

export default function Header() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Rocket className="text-primary" size={28} />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CunConnects
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground'}`}
            >
              Inicio
            </Link>
            <Link 
              to="/products" 
              className={`font-medium transition-colors hover:text-primary ${isActive('/products') ? 'text-primary' : 'text-foreground'}`}
            >
              Productos
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to={`/profile/${currentUser.id}`}
                  className={`font-medium transition-colors hover:text-primary ${location.pathname.startsWith('/profile') ? 'text-primary' : 'text-foreground'}`}
                >
                  Perfil
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                  <Link to="/create-project">
                    <Plus size={16} />
                    Crear Proyecto
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild className="hidden sm:flex">
                  <Link to="/add-product">
                    <ShoppingBag size={16} />
                    Agregar Producto
                  </Link>
                </Button>
                <Link to={`/profile/${currentUser.id}`}>
                  <UserAvatar user={currentUser} size="sm" />
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} aria-label="Cerrar Sesión">
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
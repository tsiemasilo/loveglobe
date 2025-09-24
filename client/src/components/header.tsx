import { Search, User } from "lucide-react";

interface HeaderProps {
  onHomeClick: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={onHomeClick} data-testid="header-title">
            Memory Circle
          </h1>
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={onHomeClick}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" data-testid="nav-albums">
              Albums
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" data-testid="nav-favorites">
              Favorites
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" data-testid="button-search">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" data-testid="button-profile">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

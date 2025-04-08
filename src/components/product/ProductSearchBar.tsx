
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchProducts: () => void;
  openCreateDialog: () => void;
}

const ProductSearchBar = ({
  searchQuery,
  setSearchQuery,
  searchProducts,
  openCreateDialog,
}: ProductSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">Manajemen Produk</h1>
      
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Cari produk..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && searchProducts()}
            className="pl-10"
          />
        </div>
        
        <Button onClick={searchProducts}>
          Cari
        </Button>
        
        <Button onClick={openCreateDialog}>
          <Plus size={18} className="mr-2" />
          Tambah
        </Button>
      </div>
    </div>
  );
};

export default ProductSearchBar;

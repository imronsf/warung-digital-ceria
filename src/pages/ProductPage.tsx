
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductFormValues } from "@/types/product";
import { initialProducts } from "@/constants/product";
import ProductSearchBar from "@/components/product/ProductSearchBar";
import ProductTable from "@/components/product/ProductTable";
import ProductForm from "@/components/product/ProductForm";
import DeleteProductDialog from "@/components/product/DeleteProductDialog";

const ProductPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const searchProducts = () => {
    let filtered = [...products];
    
    // Apply text search if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter if not "all"
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }
    
    setFilteredProducts(filtered);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: number) => {
    setSelectedProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteProduct = () => {
    if (selectedProductId === null) return;

    const newProducts = products.filter(product => product.id !== selectedProductId);
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    
    setIsDeleteDialogOpen(false);
    setSelectedProductId(null);
    
    toast({
      title: "Produk dihapus",
      description: "Produk berhasil dihapus dari daftar",
    });
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    let imageUrl = data.image;
    
    // If it's a data URL from FileReader, we would normally upload this to a server
    // For demo purposes, we'll just use the data URL directly
    if (data.imageFile) {
      // In a real app, you would upload the file to a server and get a URL back
      // imageUrl = await uploadImageToServer(data.imageFile);
      console.log("Image file received:", data.imageFile.name);
    }

    if (editingProduct) {
      const updated: Product[] = products.map(product => 
        product.id === editingProduct.id 
          ? { 
              id: product.id, 
              name: data.name, 
              price: data.price, 
              stock: data.stock, 
              category: data.category, 
              image: imageUrl || "/placeholder.svg" 
            } 
          : product
      );
      
      setProducts(updated);
      setFilteredProducts(updated);
      
      toast({
        title: "Produk diperbarui",
        description: `${data.name} berhasil diperbarui`,
      });
    } else {
      const newProduct: Product = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        name: data.name,
        price: data.price,
        stock: data.stock, 
        category: data.category,
        image: imageUrl || "/placeholder.svg"
      };
      
      const updated = [...products, newProduct];
      setProducts(updated);
      setFilteredProducts(updated);
      
      toast({
        title: "Produk ditambahkan",
        description: `${data.name} berhasil ditambahkan`,
      });
    }
    
    setIsDialogOpen(false);
    // Re-apply filters after updating
    searchProducts();
  };

  return (
    <div>
      <ProductSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchProducts={searchProducts}
        openCreateDialog={openCreateDialog}
        selectedCategory={selectedCategory}
        setSelectedCategory={(category) => {
          setSelectedCategory(category);
          // Apply filter immediately when category changes
          setTimeout(searchProducts, 0);
        }}
      />
      
      <ProductTable
        products={filteredProducts}
        onEdit={openEditDialog}
        onDelete={confirmDelete}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? "Perbarui detail produk yang sudah ada" 
                : "Tambahkan produk baru ke dalam sistem"}
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm
            product={editingProduct}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteProductDialog onDelete={deleteProduct} />
      </AlertDialog>
    </div>
  );
};

export default ProductPage;

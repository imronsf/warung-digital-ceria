import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Edit, Trash, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Kopi Hitam", price: 15000, stock: 20, image: "/placeholder.svg", category: "Minuman" },
  { id: 2, name: "Kopi Latte", price: 20000, stock: 15, image: "/placeholder.svg", category: "Minuman" },
  { id: 3, name: "Teh Tarik", price: 15000, stock: 25, image: "/placeholder.svg", category: "Minuman" },
  { id: 4, name: "Roti Bakar", price: 12000, stock: 18, image: "/placeholder.svg", category: "Makanan" },
  { id: 5, name: "Nasi Goreng", price: 25000, stock: 10, image: "/placeholder.svg", category: "Makanan" },
  { id: 6, name: "Mie Goreng", price: 20000, stock: 12, image: "/placeholder.svg", category: "Makanan" },
];

const categories = ["Makanan", "Minuman", "Snack", "Lainnya"];

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z.coerce.number().min(1, "Harga harus lebih dari 0"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  image: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      category: "",
      image: "/placeholder.svg",
    }
  });

  const searchProducts = () => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query)
    );
    
    setFilteredProducts(filtered);
  };

  const openCreateDialog = () => {
    form.reset({
      name: "",
      price: 0,
      stock: 0,
      category: "",
      image: "/placeholder.svg",
    });
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    form.reset({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image,
    });
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

  const onSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      const updated: Product[] = products.map(product => 
        product.id === editingProduct.id 
          ? { 
              id: product.id, 
              name: data.name, 
              price: data.price, 
              stock: data.stock, 
              category: data.category, 
              image: data.image || "/placeholder.svg" 
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
        image: data.image || "/placeholder.svg"
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
  };

  return (
    <div>
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
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Tidak ada produk yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? "text-destructive" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        className="text-destructive" 
                        onClick={() => confirmDelete(product.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Produk</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama produk" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga (Rp)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stok</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar</FormLabel>
                    <FormControl>
                      <Input 
                        disabled 
                        value="Gunakan placeholder (demo)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductPage;

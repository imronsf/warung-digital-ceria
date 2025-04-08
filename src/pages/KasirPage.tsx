
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Tipe data
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

// Data produk dummy
const dummyProducts: Product[] = [
  { id: 1, name: "Kopi Hitam", price: 15000, stock: 20, image: "/placeholder.svg", category: "Minuman" },
  { id: 2, name: "Kopi Latte", price: 20000, stock: 15, image: "/placeholder.svg", category: "Minuman" },
  { id: 3, name: "Teh Tarik", price: 15000, stock: 25, image: "/placeholder.svg", category: "Minuman" },
  { id: 4, name: "Roti Bakar", price: 12000, stock: 18, image: "/placeholder.svg", category: "Makanan" },
  { id: 5, name: "Nasi Goreng", price: 25000, stock: 10, image: "/placeholder.svg", category: "Makanan" },
  { id: 6, name: "Mie Goreng", price: 20000, stock: 12, image: "/placeholder.svg", category: "Makanan" },
];

const categories = ["Semua", "Makanan", "Minuman"];

const KasirPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.1; // 10% pajak
  const total = subtotal + tax;
  const change = Number(cashAmount) > total ? Number(cashAmount) - total : 0;

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter berdasarkan kategori
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter berdasarkan pencarian
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product: Product) => {
    // Cek apakah produk sudah ada di keranjang
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Jika sudah ada, tambahkan jumlahnya
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stok tidak mencukupi",
          description: `Stok ${product.name} tersisa ${product.stock}`,
          variant: "destructive"
        });
        return;
      }
      
      const updatedCart = cart.map(item => {
        if (item.id === product.id) {
          const newQuantity = item.quantity + 1;
          return {
            ...item,
            quantity: newQuantity,
            subtotal: product.price * newQuantity
          };
        }
        return item;
      });
      
      setCart(updatedCart);
    } else {
      // Jika belum ada, tambahkan sebagai item baru
      if (product.stock <= 0) {
        toast({
          title: "Stok habis",
          description: `${product.name} tidak tersedia`,
          variant: "destructive"
        });
        return;
      }
      
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          subtotal: product.price
        }
      ]);
    }
  };

  const removeFromCart = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (newQuantity > product.stock) {
      toast({
        title: "Stok tidak mencukupi",
        description: `Stok ${product.name} tersisa ${product.stock}`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: product.price * newQuantity
        };
      }
      return item;
    });
    
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    if (Number(cashAmount) < total) {
      toast({
        title: "Pembayaran tidak cukup",
        description: "Jumlah uang tidak mencukupi untuk total pembelian",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate saving transaction
    const transaction = {
      id: new Date().getTime(),
      customerName: customerName || "Pelanggan",
      items: cart,
      subtotal,
      tax,
      total,
      cashAmount: Number(cashAmount),
      change,
      date: new Date()
    };
    
    console.log("Transaksi berhasil:", transaction);
    
    // Save to localStorage for demo
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // Update stock
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    
    toast({
      title: "Transaksi Berhasil",
      description: `Total: Rp ${total.toLocaleString()}`
    });
    
    // Reset cart and dialog
    setCart([]);
    setCashAmount("");
    setCustomerName("");
    setCheckoutDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Section */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Kasir</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Cari produk..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="Semua" className="w-full sm:w-auto" onValueChange={setSelectedCategory}>
              <TabsList className="w-full sm:w-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="card-hover overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-32 object-cover"
              />
              <CardContent className="p-3">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">Rp {product.price.toLocaleString()}</p>
                  <Button 
                    size="sm" 
                    variant={product.stock > 0 ? "default" : "outline"}
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                  >
                    {product.stock > 0 ? "+" : "Habis"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Stok: {product.stock}
                </p>
              </CardContent>
            </Card>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-4 py-8 text-center text-muted-foreground">
              Tidak ada produk yang ditemukan
            </div>
          )}
        </div>
      </div>
      
      {/* Cart Section */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center">
                <ShoppingCart size={20} className="mr-2" />
                Keranjang
              </h2>
              {cart.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCart([])}
                >
                  Hapus Semua
                </Button>
              )}
            </div>
            
            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Keranjang kosong
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b">
                    <div className="w-12 h-12">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm">Rp {item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Cart Summary */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pajak (10%)</span>
                <span className="font-medium">Rp {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">Rp {total.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4"
              disabled={cart.length === 0}
              onClick={() => setCheckoutDialogOpen(true)}
            >
              Bayar
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pembayaran</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Nama Pelanggan (Opsional)</Label>
              <Input
                id="customer"
                placeholder="Masukkan nama pelanggan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Uang</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Masukkan jumlah uang"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span>Total Belanja:</span>
                <span className="font-medium">Rp {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Dibayar:</span>
                <span className="font-medium">
                  Rp {cashAmount ? Number(cashAmount).toLocaleString() : '0'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Kembalian:</span>
                <span className="font-medium">Rp {change.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCheckoutDialogOpen(false)}
            >
              Batal
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={!cashAmount || Number(cashAmount) < total}
            >
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KasirPage;

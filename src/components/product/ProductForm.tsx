
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Product, ProductFormValues } from "@/types/product";
import { categories } from "@/constants/product";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z.coerce.number().min(1, "Harga harus lebih dari 0"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  image: z.string().optional(),
});

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
}

const ProductForm = ({ product, onClose, onSubmit }: ProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    product ? product.image : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product ? product.name : "",
      price: product ? product.price : 0,
      stock: product ? product.stock : 0,
      category: product ? product.category : "",
      image: product ? product.image : "/placeholder.svg",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Store the file in the form
    form.setValue("imageFile", file);
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      form.setValue("image", result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              <FormLabel>Gambar Produk</FormLabel>
              <div className="flex flex-col space-y-4 items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={imagePreview || field.value} alt="Preview gambar" />
                  <AvatarFallback>IMG</AvatarFallback>
                </Avatar>
                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={triggerFileInput}
                    className="w-full"
                  >
                    Pilih Gambar
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Input type="hidden" {...field} />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {product ? "Simpan Perubahan" : "Tambah Produk"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProductForm;

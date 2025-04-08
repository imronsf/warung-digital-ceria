
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingCart, Store, Receipt, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Form schema
const storeSchema = z.object({
  name: z.string().min(1, "Nama toko wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
});

const receiptSchema = z.object({
  header: z.string().optional(),
  footer: z.string().optional(),
  showLogo: z.boolean().default(true),
  showTaxDetails: z.boolean().default(true),
});

const appSchema = z.object({
  defaultTax: z.coerce.number().min(0).max(100),
  currency: z.string(),
  theme: z.string(),
});

type StoreFormValues = z.infer<typeof storeSchema>;
type ReceiptFormValues = z.infer<typeof receiptSchema>;
type AppFormValues = z.infer<typeof appSchema>;

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("toko");
  
  // Store form
  const storeForm = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "UMKM POS Cafe",
      address: "Jl. Contoh No. 123, Jakarta",
      phone: "0812-3456-7890",
      email: "info@umkmpos.com",
    },
  });
  
  // Receipt form
  const receiptForm = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      header: "Terima Kasih Telah Berbelanja",
      footer: "Barang yang sudah dibeli tidak dapat dikembalikan",
      showLogo: true,
      showTaxDetails: true,
    },
  });
  
  // App form
  const appForm = useForm<AppFormValues>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      defaultTax: 10,
      currency: "IDR",
      theme: "light",
    },
  });
  
  const onStoreSubmit = (data: StoreFormValues) => {
    console.log("Store settings:", data);
    toast({
      title: "Pengaturan Tersimpan",
      description: "Pengaturan toko berhasil diperbarui",
    });
  };
  
  const onReceiptSubmit = (data: ReceiptFormValues) => {
    console.log("Receipt settings:", data);
    toast({
      title: "Pengaturan Tersimpan",
      description: "Pengaturan struk berhasil diperbarui",
    });
  };
  
  const onAppSubmit = (data: AppFormValues) => {
    console.log("App settings:", data);
    toast({
      title: "Pengaturan Tersimpan",
      description: "Pengaturan aplikasi berhasil diperbarui",
    });
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b-0">
          <TabsTrigger value="toko" className="flex items-center gap-2">
            <Store size={16} />
            <span>Toko</span>
          </TabsTrigger>
          <TabsTrigger value="struk" className="flex items-center gap-2">
            <Receipt size={16} />
            <span>Struk</span>
          </TabsTrigger>
          <TabsTrigger value="aplikasi" className="flex items-center gap-2">
            <ShoppingCart size={16} />
            <span>Aplikasi</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Toko Settings */}
        <TabsContent value="toko" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Toko</CardTitle>
              <CardDescription>
                Informasi dasar tentang toko Anda yang akan ditampilkan pada struk dan dokumen lainnya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...storeForm}>
                <form onSubmit={storeForm.handleSubmit(onStoreSubmit)} className="space-y-6">
                  <FormField
                    control={storeForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Toko</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama toko" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={storeForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan alamat toko" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={storeForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nomor telepon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={storeForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Opsional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Simpan Perubahan</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Struk Settings */}
        <TabsContent value="struk" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Struk</CardTitle>
              <CardDescription>
                Sesuaikan tampilan dan informasi yang ditampilkan pada struk pembelian.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...receiptForm}>
                <form onSubmit={receiptForm.handleSubmit(onReceiptSubmit)} className="space-y-6">
                  <FormField
                    control={receiptForm.control}
                    name="header"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Struk</FormLabel>
                        <FormControl>
                          <Input placeholder="Text di bagian atas struk" {...field} />
                        </FormControl>
                        <FormDescription>
                          Teks yang akan ditampilkan di bagian atas struk.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={receiptForm.control}
                    name="footer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Struk</FormLabel>
                        <FormControl>
                          <Input placeholder="Text di bagian bawah struk" {...field} />
                        </FormControl>
                        <FormDescription>
                          Teks yang akan ditampilkan di bagian bawah struk.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormField
                      control={receiptForm.control}
                      name="showLogo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div>
                            <FormLabel>Tampilkan Logo</FormLabel>
                            <FormDescription>
                              Apakah logo toko ditampilkan pada struk.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={receiptForm.control}
                      name="showTaxDetails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div>
                            <FormLabel>Tampilkan Rincian Pajak</FormLabel>
                            <FormDescription>
                              Apakah detail pajak ditampilkan pada struk.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Simpan Perubahan</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aplikasi Settings */}
        <TabsContent value="aplikasi" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Aplikasi</CardTitle>
              <CardDescription>
                Sesuaikan pengaturan aplikasi POS sesuai kebutuhan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appForm}>
                <form onSubmit={appForm.handleSubmit(onAppSubmit)} className="space-y-6">
                  <FormField
                    control={appForm.control}
                    name="defaultTax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pajak Default (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={100} {...field} />
                        </FormControl>
                        <FormDescription>
                          Persentase pajak yang digunakan secara default untuk transaksi.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={appForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mata Uang</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih mata uang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                            <SelectItem value="USD">Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={appForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema Aplikasi</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tema" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Terang</SelectItem>
                            <SelectItem value="dark">Gelap</SelectItem>
                            <SelectItem value="system">Ikuti Sistem</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Simpan Perubahan</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

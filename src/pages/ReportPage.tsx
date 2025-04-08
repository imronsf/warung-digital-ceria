
import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Download, TrendingUp, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: number;
  date: string;
  total: number;
  items: Array<{ name: string; quantity: number; subtotal: number }>;
}

// Generate dummy data
const generateDummyData = (): Transaction[] => {
  const today = new Date();
  const result: Transaction[] = [];
  
  // Generate 30 days of data with random sales
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const itemCount = Math.floor(Math.random() * 5) + 1; // 1-5 items per transaction
    const items = [];
    
    // Generate random items for this transaction
    for (let j = 0; j < itemCount; j++) {
      const productNames = ["Kopi Hitam", "Kopi Latte", "Teh Tarik", "Roti Bakar", "Nasi Goreng", "Mie Goreng"];
      const name = productNames[Math.floor(Math.random() * productNames.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      const price = Math.floor(Math.random() * 15000) + 10000; // 10000-25000 price
      const subtotal = price * quantity;
      
      items.push({
        name,
        quantity,
        subtotal,
      });
    }
    
    // Calculate total from items
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    result.push({
      id: 1000 + i,
      date: date.toISOString(),
      total,
      items,
    });
  }
  
  return result;
};

const COLORS = ['#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F59E0B', '#EF4444'];

const ReportPage = () => {
  const [timeRange, setTimeRange] = useState("week");
  const transactions = useMemo(() => generateDummyData(), []);
  
  // Filter transactions by selected time range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case "day":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    return transactions.filter(tx => new Date(tx.date) >= cutoffDate);
  }, [transactions, timeRange]);
  
  // Calculate totals for cards
  const totalSales = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.total, 0);
  }, [filteredTransactions]);
  
  const totalTransactions = filteredTransactions.length;
  
  const averageTransaction = totalTransactions > 0 
    ? totalSales / totalTransactions 
    : 0;
  
  // Prepare data for charts
  const salesByDay = useMemo(() => {
    const salesMap = new Map<string, number>();
    
    filteredTransactions.forEach(tx => {
      const date = format(new Date(tx.date), "dd MMM", { locale: id });
      const currentTotal = salesMap.get(date) || 0;
      salesMap.set(date, currentTotal + tx.total);
    });
    
    // Convert map to array and sort by date
    return Array.from(salesMap.entries())
      .map(([date, total]) => ({ date, total }))
      .reverse();
  }, [filteredTransactions]);
  
  // Product sales data for pie chart
  const productSales = useMemo(() => {
    const productsMap = new Map<string, number>();
    
    filteredTransactions.forEach(tx => {
      tx.items.forEach(item => {
        const currentTotal = productsMap.get(item.name) || 0;
        productsMap.set(item.name, currentTotal + item.subtotal);
      });
    });
    
    // Convert map to array and sort by sales
    return Array.from(productsMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 products
  }, [filteredTransactions]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hari Ini</SelectItem>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Penjualan
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                Rp {totalSales.toLocaleString()}
              </CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {timeRange === "day" ? "Hari ini" : 
               timeRange === "week" ? "7 hari terakhir" : 
               "30 hari terakhir"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Jumlah Transaksi
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                {totalTransactions}
              </CardDescription>
            </div>
            <CreditCard className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {timeRange === "day" ? "Hari ini" : 
               timeRange === "week" ? "7 hari terakhir" : 
               "30 hari terakhir"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rata-rata Transaksi
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                Rp {averageTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </CardDescription>
            </div>
            <Banknote className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Per transaksi
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Penjualan</TabsTrigger>
          <TabsTrigger value="products">Produk Terlaris</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Penjualan Harian</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByDay}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `Rp ${(value / 1000)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Penjualan']}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Penjualan" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Produk Terlaris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productSales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Penjualan']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Product sales list */}
              <div className="mt-6">
                <h4 className="font-medium mb-2">Daftar Produk Terlaris</h4>
                <div className="space-y-2">
                  {productSales.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <span>{product.name}</span>
                      </div>
                      <span className="font-medium">
                        Rp {product.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPage;

import { useState, useEffect } from "react";
import { Search, Calendar, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Transaction {
  id: number;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  cashAmount: number;
  change: number;
  date: string;
}

const getDummyTransactions = (): Transaction[] => {
  // Get transactions from localStorage if available (from KasirPage)
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    return JSON.parse(storedTransactions).map((t: any) => ({
      ...t,
      date: new Date(t.date).toISOString(),
    }));
  }

  // Otherwise return dummy data
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  
  return [
    {
      id: 1001,
      customerName: "Budi",
      items: [
        { id: 1, name: "Kopi Hitam", price: 15000, quantity: 2, subtotal: 30000 },
        { id: 4, name: "Roti Bakar", price: 12000, quantity: 1, subtotal: 12000 },
      ],
      subtotal: 42000,
      tax: 4200,
      total: 46200,
      cashAmount: 50000,
      change: 3800,
      date: now.toISOString(),
    },
    {
      id: 1002,
      customerName: "Ani",
      items: [
        { id: 2, name: "Kopi Latte", price: 20000, quantity: 1, subtotal: 20000 },
        { id: 5, name: "Nasi Goreng", price: 25000, quantity: 1, subtotal: 25000 },
      ],
      subtotal: 45000,
      tax: 4500,
      total: 49500,
      cashAmount: 50000,
      change: 500,
      date: yesterday.toISOString(),
    },
    {
      id: 1003,
      customerName: "Citra",
      items: [
        { id: 3, name: "Teh Tarik", price: 15000, quantity: 2, subtotal: 30000 },
        { id: 6, name: "Mie Goreng", price: 20000, quantity: 1, subtotal: 20000 },
      ],
      subtotal: 50000,
      tax: 5000,
      total: 55000,
      cashAmount: 100000,
      change: 45000,
      date: twoDaysAgo.toISOString(),
    },
  ];
};

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredTransactions.slice(startIndex, endIndex);

  useEffect(() => {
    const data = getDummyTransactions();
    setTransactions(data);
    setFilteredTransactions(data);
  }, []);

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.id.toString().includes(query) ||
        transaction.customerName.toLowerCase().includes(query)
      );
    }
    
    // Filter by date
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(transaction => {
        const txDate = new Date(transaction.date);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === date.getTime();
      });
    } else if (dateRange !== "all") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      let cutoffDate = new Date(now);
      
      switch (dateRange) {
        case "today":
          // Already set
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(transaction => {
        const txDate = new Date(transaction.date);
        return txDate >= cutoffDate && txDate <= now;
      });
    }
    
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const viewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Cari</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Cari ID transaksi atau nama pelanggan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && filterTransactions()}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter Tanggal</label>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="today">Hari ini</SelectItem>
                <SelectItem value="week">Minggu ini</SelectItem>
                <SelectItem value="month">Bulan ini</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto flex gap-2">
                  <Calendar size={16} />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button onClick={filterTransactions}>
              Filter
            </Button>
            
            {(searchQuery || selectedDate || dateRange !== "all") && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDate(undefined);
                  setDateRange("all");
                  setFilteredTransactions(transactions);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Tidak ada transaksi yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">#{transaction.id}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.customerName}</TableCell>
                  <TableCell>Rp {transaction.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex gap-2"
                      onClick={() => viewTransactionDetails(transaction)}
                    >
                      <Eye size={16} />
                      <span>Detail</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Transaction Detail Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Transaksi #{selectedTransaction?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal:</span>
                  <span>{formatDate(selectedTransaction.date)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pelanggan:</span>
                  <span>{selectedTransaction.customerName}</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Item</h4>
                  <div className="space-y-2">
                    {selectedTransaction.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>Rp {item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {selectedTransaction.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Pajak (10%)</span>
                    <span>Rp {selectedTransaction.tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp {selectedTransaction.total.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-2 border-t mt-2 flex justify-between">
                    <span>Dibayar</span>
                    <span>Rp {selectedTransaction.cashAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Kembalian</span>
                    <span>Rp {selectedTransaction.change.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Button className="mt-6 w-full" variant="outline">
                <Download size={16} className="mr-2" />
                Cetak Struk
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionHistoryPage;

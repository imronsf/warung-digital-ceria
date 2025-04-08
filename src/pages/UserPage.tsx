
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Edit, Trash, Plus, User } from "lucide-react";
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

interface UserData {
  id: number;
  name: string;
  username: string;
  role: "admin" | "kasir";
}

// Data pengguna dummy
const initialUsers: UserData[] = [
  { id: 1, name: "Admin", username: "admin", role: "admin" },
  { id: 2, name: "Budi Santoso", username: "budi", role: "kasir" },
  { id: 3, name: "Siti Nurhaliza", username: "siti", role: "kasir" },
];

const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["admin", "kasir"], {
    required_error: "Role wajib dipilih",
  }),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "kasir",
    }
  });

  const searchUsers = () => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.username.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  };

  const openCreateDialog = () => {
    form.reset({
      name: "",
      username: "",
      password: "",
      role: "kasir",
    });
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: UserData) => {
    form.reset({
      name: user.name,
      username: user.username,
      password: "", // Password field blank when editing
      role: user.role,
    });
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: number) => {
    setSelectedUserId(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteUser = () => {
    if (selectedUserId === null) return;

    const newUsers = users.filter(user => user.id !== selectedUserId);
    setUsers(newUsers);
    setFilteredUsers(newUsers);
    
    setIsDeleteDialogOpen(false);
    setSelectedUserId(null);
    
    toast({
      title: "Pengguna dihapus",
      description: "Pengguna berhasil dihapus dari sistem",
    });
  };

  const onSubmit = (data: UserFormValues) => {
    if (editingUser) {
      // Update existing user
      const updated = users.map(user => 
        user.id === editingUser.id 
          ? { ...user, name: data.name, username: data.username, role: data.role } 
          : user
      );
      
      setUsers(updated);
      setFilteredUsers(updated);
      
      toast({
        title: "Pengguna diperbarui",
        description: `${data.name} berhasil diperbarui`,
      });
    } else {
      // Create new user
      const newUser = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        name: data.name,
        username: data.username,
        role: data.role,
      };
      
      const updated = [...users, newUser];
      setUsers(updated);
      setFilteredUsers(updated);
      
      toast({
        title: "Pengguna ditambahkan",
        description: `${data.name} berhasil ditambahkan`,
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Cari pengguna..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && searchUsers()}
              className="pl-10"
            />
          </div>
          
          <Button onClick={searchUsers}>
            Cari
          </Button>
          
          <Button onClick={openCreateDialog}>
            <Plus size={18} className="mr-2" />
            Tambah
          </Button>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Tidak ada pengguna yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Kasir'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        className="text-destructive" 
                        onClick={() => confirmDelete(user.id)}
                        disabled={user.username === 'admin'} // Prevent deleting main admin
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
      
      {/* Create/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Perbarui detail pengguna yang sudah ada" 
                : "Tambahkan pengguna baru ke dalam sistem"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan username untuk login" 
                        {...field} 
                        disabled={editingUser?.username === 'admin'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {editingUser ? "Password (Kosongkan jika tidak diubah)" : "Password"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={editingUser ? "••••••" : "Masukkan password"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={editingUser?.username === 'admin'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="kasir">Kasir</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserPage;

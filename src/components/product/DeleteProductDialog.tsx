
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteProductDialogProps {
  onDelete: () => void;
}

const DeleteProductDialog = ({ onDelete }: DeleteProductDialogProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
        <AlertDialogDescription>
          Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
          Hapus
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteProductDialog;

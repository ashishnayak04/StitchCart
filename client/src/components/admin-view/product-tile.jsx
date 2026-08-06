import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const hasSale = product?.salePrice > 0;

  return (
    <div className="bg-surface-raised border border-border group shadow-1">
      <div className="aspect-square overflow-hidden bg-surface">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-luxury"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-serif text-base font-medium text-foreground truncate">
          {product?.title}
        </h3>
        <div className="flex items-center justify-between">
          {hasSale ? (
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-accent">
                ${product?.salePrice}
              </span>
              <span className="text-xs text-muted line-through">
                ${product?.price}
              </span>
            </div>
          ) : (
            <span className="font-serif font-semibold text-foreground">
              ${product?.price}
            </span>
          )}
          <span className="text-xs text-muted">
            Stock: {product?.totalStock}
          </span>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-danger hover:text-danger hover:bg-danger/10"
            onClick={() => handleDelete(product?._id)}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductTile;

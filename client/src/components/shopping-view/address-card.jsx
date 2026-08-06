import { MapPin, Edit2, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <div
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`border p-5 cursor-pointer transition-all duration-fast ${
        isSelected
          ? "border-accent bg-accent/5"
          : "border-border hover:border-taupe"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <MapPin className={`w-5 h-5 mt-0.5 ${isSelected ? "text-accent" : "text-muted"}`} />
        <div className="flex-1 space-y-1">
          <p className="text-sm text-foreground font-medium">
            {addressInfo?.address}
          </p>
          <p className="text-xs text-muted">{addressInfo?.city}</p>
          <p className="text-xs text-muted">Pincode: {addressInfo?.pincode}</p>
          <p className="text-xs text-muted">Phone: {addressInfo?.phone}</p>
          {addressInfo?.notes && (
            <p className="text-xs text-muted italic">
              Notes: {addressInfo?.notes}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          className="flex items-center gap-1 text-xs text-muted hover:text-danger transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default AddressCard;

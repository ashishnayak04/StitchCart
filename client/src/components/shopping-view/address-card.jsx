import { Button } from "../ui/button";
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
      className={`border p-5 cursor-pointer transition-all ${
        isSelected
          ? "border-luxury-gold bg-luxury-gold/5"
          : "border-luxury-beige/50 hover:border-luxury-taupe"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <MapPin className={`w-5 h-5 mt-0.5 ${isSelected ? "text-luxury-gold" : "text-luxury-taupe"}`} />
        <div className="flex-1 space-y-1">
          <p className="text-sm text-luxury-charcoal font-medium">
            {addressInfo?.address}
          </p>
          <p className="text-xs text-luxury-taupe">{addressInfo?.city}</p>
          <p className="text-xs text-luxury-taupe">Pincode: {addressInfo?.pincode}</p>
          <p className="text-xs text-luxury-taupe">Phone: {addressInfo?.phone}</p>
          {addressInfo?.notes && (
            <p className="text-xs text-luxury-taupe italic">
              Notes: {addressInfo?.notes}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-luxury-beige/30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="flex items-center gap-1 text-xs text-luxury-taupe hover:text-luxury-charcoal transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          className="flex items-center gap-1 text-xs text-luxury-taupe hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default AddressCard;

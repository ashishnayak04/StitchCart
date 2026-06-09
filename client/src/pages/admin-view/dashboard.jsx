import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({ title: "Feature image removed from slider" });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-luxury-charcoal">
          Dashboard
        </h1>
        <p className="text-sm text-luxury-taupe mt-1">
          Manage your homepage banner images
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="bg-white border border-luxury-beige/50 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-luxury-cream rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-luxury-charcoal">
                  Upload Banner
                </h2>
                <p className="text-xs text-luxury-taupe">
                  Add images to homepage slider
                </p>
              </div>
            </div>
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isCustomStyling={true}
            />
            <Button
              onClick={handleUploadFeatureImage}
              disabled={!uploadedImageUrl}
              className="w-full bg-luxury-charcoal hover:bg-luxury-brown text-luxury-ivory uppercase tracking-wider"
            >
              Upload to Slider
            </Button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="md:col-span-2 lg:col-span-2">
          <div className="bg-white border border-luxury-beige/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-luxury-cream rounded-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-luxury-charcoal">
                  Banner Gallery
                </h2>
                <p className="text-xs text-luxury-taupe">
                  {featureImageList?.length || 0} images
                </p>
              </div>
            </div>
            {featureImageList && featureImageList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featureImageList.map((featureImgItem, idx) => (
                  <div key={idx} className="relative group aspect-video overflow-hidden bg-luxury-cream">
                    <img
                      src={featureImgItem.image}
                      alt={`Banner ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-luxury-beige">
                <ImageIcon className="w-8 h-8 text-luxury-beige mx-auto mb-2" />
                <p className="text-sm text-luxury-taupe">No banner images yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

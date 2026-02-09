import React, { useState, useMemo } from "react";
import type { Order } from "../types";
import {
  useDeleteOrderItemMutation,
  useUpdateOrderMutation,
} from "../redux/apislice";
import { generateUploadButton } from "@uploadthing/react";
import { toast, ToastContainer } from "react-toastify";
import imageCompression from "browser-image-compression";

interface OrderItemProps {
  orderId: string;
  orderName: string;
  initialImages: Order["items"] | [];
}

const OrderItem: React.FC<OrderItemProps> = ({
  orderId,
  orderName,

  initialImages,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrderItem] = useDeleteOrderItemMutation();
  const [isCompressing, setisCompressing] = useState(false);

  const UploadButton = useMemo(
    () =>
      generateUploadButton({
        url: `${import.meta.env.VITE_BASE_URL}/api/uploadthing/${orderId}`,
      }),
    [],
  );
  const images = useMemo(() => initialImages, [initialImages]);
  if (!images) return;

  const openImageViewer = (index: number) => {
    setCurrentIndex(index);
    setIsViewerOpen(true);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentIndex(-1);
  };

  const removeImage = async (key: string) => {
    try {
      const resp = await deleteOrderItem({ _id: orderId, id: key });
      if (resp && resp.data?.status == 200) {
        toast.success("item removed");
      }
    } catch (error) {
      toast.error("Try again!!");
    }
  };

  return (
    <div className="p-4 font-sans bg-white border border-gray-200 rounded-lg shadow-sm order-item-container">
      <ToastContainer />

      {/* Order Header */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:justify-between sm:items-center">
        <UploadButton
          endpoint="imageUploader"
          disabled={isCompressing}
          onBeforeUploadBegin={async (files) => {
            toast.success("Processing...");
            setisCompressing(true);
            const compressedFiles = await Promise.all(
              files.map(async (file) => {
                const compressed = await imageCompression(file, {
                  maxSizeMB: 0.8,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true,
                  initialQuality: 0.85,
                  fileType: "image/webp", // <-- convert to WebP
                });

                // UploadThing requires File objects
                return new File(
                  [compressed],
                  file.name.replace(/\.\w+$/, ".webp"),
                  {
                    type: compressed.type,
                  },
                );
              }),
            );
            setisCompressing(false);
            toast.success("Upload starting...");

            return compressedFiles;
          }}
          onClientUploadComplete={async (res) => {
            if (!initialImages) return;
            if (initialImages?.length === 0) {
              await updateOrder({
                _id: orderId,
                items: res.map((item) => ({
                  id: item.key,
                  url: item.ufsUrl,
                  description: "",
                })),
              });
            } else {
              await updateOrder({
                _id: orderId,
                items: [
                  ...initialImages,
                  ...res.map((item) => ({
                    id: item.key,
                    url: item.ufsUrl,
                    description: "",
                  })),
                ],
              });
            }
          }}
          onUploadError={(error) => {
            toast.error("image not uploded. " + error.message);
            setisCompressing(false);
          }}
          className="px-4 py-2 font-semibold transition-colors duration-200 bg-green-400 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        />
      </div>

      {/* Thumbnail Grid - Stacked small pics (max 4 visible) */}
      {images.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-600">
            Click a thumbnail to view:
          </p>
          <div className="flex flex-wrap gap-2">
            {images.slice(0, 4).map((img, index) => (
              <div
                key={img.id}
                className="relative cursor-pointer group"
                onClick={() => openImageViewer(index)}
              >
                {/* Thumbnail Image */}
                <img
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-20 h-20 transition-all duration-200 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:scale-105"
                />

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute z-10 flex items-center justify-center w-6 h-6 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100 hover:bg-red-600"
                  aria-label="Remove image"
                >
                  ×
                </button>

                {/* Overlay for selected image */}
                {currentIndex === index && (
                  <div className="absolute inset-0 bg-blue-500 border-2 border-blue-500 rounded-md pointer-events-none bg-opacity-20"></div>
                )}
              </div>
            ))}

            {/* Show count if more than 4 images */}
            {images.length > 4 && (
              <div
                className="flex items-center justify-center w-20 h-20 bg-gray-100 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                onClick={() => openImageViewer(4)}
              >
                <span className="font-semibold text-gray-600">
                  +{images.length - 4}
                </span>
              </div>
            )}
          </div>

          {/* Image counter below thumbnails */}
          <div className="mt-2 text-xs text-gray-500">
            {images.length} image{images.length !== 1 ? "s" : ""} uploaded
          </div>
        </div>
      )}

      {/* Image Viewer Modal - Opens when clicking thumbnails */}
      {isViewerOpen && currentIndex >= 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
          <div className="relative bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {orderName} - Image {currentIndex + 1} of {images.length}
              </h3>
              <button
                onClick={closeImageViewer}
                className="p-1 text-2xl text-gray-500 hover:text-gray-700"
                aria-label="Close viewer"
              >
                ✕
              </button>
            </div>

            {/* Main Image Container with Navigation Buttons */}
            <div className="relative flex items-center justify-center flex-1 min-h-0 p-4">
              {/* Left Navigation Button */}
              {currentIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute z-10 flex items-center justify-center w-10 h-10 text-gray-800 transition-all duration-200 transform -translate-y-1/2 bg-white rounded-full shadow-lg left-4 top-1/2 bg-opacity-90 hover:bg-opacity-100 sm:w-12 sm:h-12 hover:shadow-xl"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </button>
              )}

              {/* Main Image */}
              <div className="flex items-center justify-center flex-1 h-full">
                <img
                  src={images[currentIndex].url}
                  alt={`View ${currentIndex + 1}`}
                  className="max-h-[50vh] sm:max-h-[60vh] max-w-full object-contain rounded-lg"
                />
              </div>

              {/* Right Navigation Button */}
              {currentIndex < images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute z-10 flex items-center justify-center w-10 h-10 text-gray-800 transition-all duration-200 transform -translate-y-1/2 bg-white rounded-full shadow-lg right-4 top-1/2 bg-opacity-90 hover:bg-opacity-100 sm:w-12 sm:h-12 hover:shadow-xl"
                  aria-label="Next image"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              )}
            </div>

            {/* Thumbnail Strip & Controls */}
            <div className="p-4 border-t rounded-b-lg bg-gray-50">
              {/* Thumbnail strip with scrollbar */}
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      currentIndex === index
                        ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumb ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center justify-between gap-3 pt-3 mt-4 border-t sm:flex-row">
                <div className="text-sm text-gray-600">
                  Image {currentIndex + 1} of {images.length}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => removeImage(images[currentIndex + 1].id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 transition-colors duration-200 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Remove This Image
                  </button>

                  <button
                    onClick={closeImageViewer}
                    className="px-4 py-2 text-sm text-gray-700 transition-colors duration-200 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="py-8 text-center border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <p className="font-medium text-gray-500">No images uploaded yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Upload images to track this order
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderItem;

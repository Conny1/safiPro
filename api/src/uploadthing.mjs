// uploadThing.mjs
import { createUploadthing } from "uploadthing/express";


const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "10MB", maxFileCount: 10,  },
  })
    .middleware(({ req, res }) => {
      let orderID = req.baseUrl.split("/")[req.baseUrl.split("/").length - 1];
      return { orderId: orderID };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.error(file,"ORDERS");
  
    }),
};

import React from 'react'
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

// category na page no data fetch krva mate
export const getCatalogaPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId: categoryId,});

        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

         result = response?.data;

  }
  catch(error) {
    // console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.response.data.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}


import React, { useEffect, useState } from "react"

import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "../../App.css";

import RatingStars from "../common/RatingStars"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 30; //15
  const [slidesPerView, setSlidesPerView] = useState(3);
  
  const updateSlidesPerView = () => {
    if (window.innerWidth < 930) {
      setSlidesPerView(1);
    } else if (window.innerWidth < 1100) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(3);
    }
  };


  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => {
      window.removeEventListener('resize', updateSlidesPerView);
};})

  useEffect(() => {
    ; (async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])


  return (
    <div className="text-lg max-w-maxContent">
      <div className="my-[50px] p-4 h-fitContent max-w-maxContentTab lg:max-w-maxContent overflow-x-hidden">
        <Swiper
          slidesPerView={slidesPerView} 
          spaceBetween={30}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay, Navigation]} // Include Navigation module
          navigation={true} // Enable navigation
          className="w-[300px] lg:w-9/12 md:w-[600px] xl:w-full h-full"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-1  bg-richblack-800 rounded-xl p-3 text-[14px] text-richblack-25">
                  <div className="flex items-center gap-2 text-2xl">
                    <img 
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover mx-5 my-2"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-5 italic p-5 text-center">
                    {review?.review.split(" ").length > truncateWords
                      ? `"${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ..."`
                      : `"${review?.review}"`}
                  </p>
                  <div className="mx-auto">
                  <div className="flex items-center gap-2">
             
                  </div>
                    <h3 className="font-semibold text-yellow-100 text-center">
                      {review.rating.toFixed(1)}
                    </h3>
                    <RatingStars Review_Count={review.rating} />

                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
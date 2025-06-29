import React, { useState,useEffect } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";
import AOS from "aos";
import 'aos/dist/aos.css';

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {

  useEffect(() => {
    AOS.init();
  }, []);

  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  // je current card hoy tene white colour ma batavanu che etle
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div>
      {/* Explore more section */}
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          <div className="container" style={{display: "block"}}>
            Unlock the
            <HighlightText style={{display:"inline"}} text={"Power of Code"} />
          </div>
          <p className="text-center text-richblack-300 text-sm font-semibold mt-1">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 -mt-5 mx-auto w-full sm:w-max bg-richblack-800 text-richblack-200 p-1 font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] overflow-x-auto rounded-none lg:rounded-full mb-6 lg:mb-0">

          {tabsName.map((ele, index) => (
            <div
              className={`text-[15px] sm:text-[16px] flex flex-row items-center gap-2
                ${currentTab === ele
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
                }
                px-4 sm:px-6 py-2
                rounded-md lg:rounded-full
                transition-all duration-200 cursor-pointer
                hover:bg-white hover:text-richblack-900 hover:drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]`}
              key={index}
              onClick={() => setMyCards(ele)}
            >
              {ele}
            </div>
          ))}
      </div>

      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Course Cards Group */}
      <div
      className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;
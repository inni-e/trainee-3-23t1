import { CourseData } from "~/data/dummy";
import { useState } from "react";
import Course from "./Course";
import { api } from "~/utils/api";

const AllCourses = () => {
  const userId = "clib6czlb0000tl9klkiw48he";
  // CourseData
  const { data: course } = api.user.getUserCourses.useQuery({ userId });

  if (!course) return <></>;

  return (
    <div className="h-full">
      {course.data.map((course, index) => {
        return <Course course={course} key={index} />;
      })}
    </div>
  );
};

export default AllCourses;

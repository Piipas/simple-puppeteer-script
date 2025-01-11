import { getSearchCourses } from "./functions/getSearchCourses";

console.log(process.env?.KEYWORD);

getSearchCourses(process.env?.KEYWORD || "ccna");

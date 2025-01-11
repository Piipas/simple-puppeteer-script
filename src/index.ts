import { getSearchCourses } from "./functions/getSearchCourses";

getSearchCourses(process.env?.KEYWORD || "ccna");

import { biblicalStudy } from "./schemaTypes/biblicalStudy";
import blog from "./schemaTypes/blog";
import book from "./schemaTypes/books";
import contentThemesBook from "./schemaTypes/contentThemesBooks";
import country from "./schemaTypes/country";
import culturaPost from "./schemaTypes/culturaPost";
import event from "./schemaTypes/events";
import { faitPoints } from "./schemaTypes/faitPoints";
import globalDepartment from "./schemaTypes/globalDepartment";
import localEvents from "./schemaTypes/localEvents";
import localities from "./schemaTypes/localities";
import notifications from "./schemaTypes/notifications";
import sales from "./schemaTypes/sales";
import { studyCategory } from "./schemaTypes/studyCategory";
import varonilPost from "./schemaTypes/varonilPost";
import juvenilPost from "./schemaTypes/juvenilPost";
import femenilPost from "./schemaTypes/femenilPost";
import infantilPost from "./schemaTypes/infantilPost";
import heroPromo from "./schemaTypes/heroPromo";

export const schema = {
  types: [
    heroPromo,
    book,
    event,
    localEvents,
    country,
    globalDepartment,
    studyCategory,
    biblicalStudy,
    sales,
    contentThemesBook,
    faitPoints,
    localities,
    notifications,
    blog,
    culturaPost,
    varonilPost,
    femenilPost,
    juvenilPost,
    infantilPost,

  ],
}

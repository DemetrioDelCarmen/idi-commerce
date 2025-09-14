import CategoryStudySelectors from "../components/CategoryStudySelector";

export const biblicalStudy = {
    name: "biblicalStudy",
    title: "Estudios Bíblicos",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Título",
            type: "string"
        },
        {
            name: "link",
            title: "Enlace del video",
            type: "string"
        },
        {
            name: "date",
            title: "Fecha de creación",
            type: "date"
        },
        {
            name: "category",
            title: "Categoría",
            type: "string",
            components: {
                input: CategoryStudySelectors
            }
        }
    ]
}
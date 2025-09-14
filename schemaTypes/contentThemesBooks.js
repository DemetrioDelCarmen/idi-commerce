import { BookIcon } from '@sanity/icons'
import BookThemeSelector from "../components/BookThemeSelector";

const contentThemesBook = {
    name: "contentThemesBook",
    title: "Temas y contenido",
    type: "document",
    icon: BookIcon,
    fields: [
        {
            name: "associatedBook",
            title: "Libro asociado",
            type: "string",
            components: {
                input: BookThemeSelector,
            },
        },
        {
            name: "title",
            title: "Título",
            type: "string"
        },
        {
            name: "content",
            title: "Contenido",
            type: "array",
            of: [{ type: "block" }]
        },
        {
            name: "date",
            title: "Fecha",
            type: "date"
        },
    ]
}

export default contentThemesBook;
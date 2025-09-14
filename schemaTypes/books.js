import CategoryStudySelectors from "../components/CategoryStudySelector";
import { BookIcon } from '@sanity/icons'


const book = {
    name: "book",
    title: "Cuadernos digitales",
    type: "document",
    icon: BookIcon,
    fields: [
        {
            name: "title",
            title: "Nombre del cuaderno",
            type: "string"
        },
        {
            name: "category",
            title: "Categoría",
            type: "string",
            components: {
                input: CategoryStudySelectors
            }
        },
        {
            name: "subtitle",
            title: "Subtítulo",
            type: "string"
        },
        {
            name: "description",
            title: "Prólogo",
            type: "string"
        },
        {
            name: "link",
            title: "Enlace para compartir",
            type: "slug",
            options: {
                source: "title",
                maxLenght: 96
            }
        },
        {
            name: "pdfFile",
            title: "Archivo PDF",
            type: "file",
            options: {
                accept: 'application/pdf' // Acepta solo archivos PDF
            },
        },
        {
            name: "language",
            title: "Lenguaje",
            type: "string",
            options: {
                list: [
                    { title: "Español", value: "espanol" },
                    { title: "Inglés", value: "ingles" },
                ]
            }
        },
        {
            name: "price",
            title: "Precio",
            type: "number",
        },
        {
            name: "comparisonPrice",
            title: "Precio de comparación",
            type: "number",
        },
        {
            name: "image",
            title: "Imagen de portada",
            type: "image",
            options: {
                hotspot: true
            },
            fields: [
                {
                    name: "alt",
                    title: "Alt",
                    type: "string"
                }
            ]
        },
    ]
}

export default book;
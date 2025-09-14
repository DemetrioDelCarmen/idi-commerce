import { BlockContentIcon } from '@sanity/icons'
import CategoryStudySelectors from '../components/CategoryStudySelector';

const blog = {
    name: "blog",
    title: "Blog de Estudios Bíblicos",
    type: "document",
    icon: BlockContentIcon,
    fields: [
        {
            name: "title",
            title: "Título",
            type: "string"
        },
        {
            name: "description",
            title: "Descripción",
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
            name: "date",
            title: "Fecha",
            type: "date"
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
        {
            name: "content",
            title: "Content",
            type: "array",
            of: [{ type: "block" }]
        },
        {
            name: "attached",
            title: "Revista",
            type: "file",
            validation: Rule => Rule.required(),
            options: {
                storeOriginalFilename: true // Mantiene el nombre original del archivo
            }
        },
    ]
}

export default blog;
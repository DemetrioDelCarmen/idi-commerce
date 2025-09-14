import { HomeIcon } from '@sanity/icons'


const globalDepartment = {
    name: "globalDepartment",
    title: "Departamentos internacionales",
    type: "document",
    icon: HomeIcon,
    fields: [
        {
            name: "name",
            title: "Nombre del Departamento",
            type: "string",
        },
        {
            name: "description",
            title: "Descripción",
            type: "text"
        },
        {
            name: "image",
            title: "Bandera",
            type: "image",
            options: { hotspot: true },
        },
        {
            name: "manager",
            title: "Responsable o encargado",
            type: "string"
        }
    ],
};

export default globalDepartment;
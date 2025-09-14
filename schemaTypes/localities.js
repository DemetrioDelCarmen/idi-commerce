// localities.js
import { PinIcon } from '@sanity/icons';
import StateSelector from '../components/StateSelector';

const localities = {
    name: "localities",
    title: "Localidades",
    type: "document",
    icon: PinIcon,
    fields: [
        {
            name: "name",
            title: "Nombre de la Localidad (Iglesia)",
            type: "string",
        },
        {
            name: "country",
            title: "País",
            type: "reference",
            to: [{ type: "country" }],  // Reference to the 'country' document
            validation: Rule => Rule.required(),
        },
        {
            name: "state",
            title: "Estado",
            type: "string",
            components: {
                input: StateSelector,
            },
            validation: Rule => Rule.required(),
        },
        {
            name: "location",
            title: "Dirección",
            type: "string",
        },
        {
            name: "mapLink",
            title: "Google Maps",
            type: "url",
        },
    ],
};

export default localities;

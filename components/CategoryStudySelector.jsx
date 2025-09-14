"use client";

import React, { useEffect, useState } from "react";
import { useClient } from "sanity";
import { Box, Select } from "@sanity/ui";
import { set, unset } from "sanity";


export default function CategoryStudySelectors(props) {

    const { onChange, value, elementProps } = props;

    const [categories, setCategories] = useState([]);
    const client = useClient();

    useEffect(() => {
        const fetchData = async () => {
            const result = await client.fetch(`*[_type=="studyCategory"]{title}`);
            setCategories(result.map(cat => cat.title));
        }

        fetchData();
    }, [client]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onChange(selectedValue ? set(selectedValue) : unset());
    }
    return (
        <Box>
            <Select
                {...elementProps}
                value={value}
                onChange={handleChange}
            >
                <option value="">Selecciona una categoría</option>
                {
                    categories.map((cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    )))
                }
            </Select>
        </Box>
    )
}

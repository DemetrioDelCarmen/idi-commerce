"use client";
import React, { useEffect, useState } from "react";
import { useFormValue, useClient } from "sanity";
import { Box, Select } from "@sanity/ui";
import { set, unset } from "sanity";

const StateSelector = (props) => {
    const { onChange, value, elementProps } = props;
    const country = useFormValue(["country"]);
    const [states, setStates] = useState([]);
    const client = useClient();

    useEffect(() => {
        if (country) {
            const fetchData = async () => {
                const query = `*[_type == "country" && _id == $countryId]{
                    states
                }`;
                const params = { countryId: country._ref };
                const result = await client.fetch(query, params);
                if (result.length > 0) {
                    setStates(result[0].states);
                } else {
                    setStates([]);
                }
            };
            fetchData();
        } else {
            setStates([]);
        }
    }, [country, client]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onChange(selectedValue ? set(selectedValue) : unset());
    };

    return (
        <Box>
            <Select
                {...elementProps}
                value={value}
                onChange={handleChange}
            >
                <option value="">Selecciona un estado</option>
                {states.map((state) => (
                    <option key={state} value={state}>
                        {state}
                    </option>
                ))}
            </Select>
        </Box>
    );
};

export default StateSelector;
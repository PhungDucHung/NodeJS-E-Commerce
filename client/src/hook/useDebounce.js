import React, { useEffect, useState } from 'react';

const useDebounce = (value, ms) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        // Set up the debounce timer
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, ms);

        // Cleanup function to clear the timer if the component unmounts or dependencies change
        return () => {
            clearTimeout(timer);
        };
    }, [value, ms]);

    return debounceValue;
};

export default useDebounce;

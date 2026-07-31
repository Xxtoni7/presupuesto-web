import { useCallback, useEffect, useMemo, useState } from "react";
import { getAvailablePlans } from "../../../../api/planApi";

function useAvailablePlans() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function loadPlans() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await getAvailablePlans();
                const availablePlans = Array.isArray(response)
                    ? response
                    : response?.data;

                if (!Array.isArray(availablePlans)) {
                    throw new TypeError("La API no devolvió una lista de planes.");
                }

                if (isMounted) {
                    setPlans(availablePlans);
                }
            } catch {
                if (isMounted) {
                    setErrorMessage(
                        "No pudimos cargar los planes en este momento.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadPlans();

        return () => {
            isMounted = false;
        };
    }, [reloadKey]);

    const sortedPlans = useMemo(() => {
        return [...plans].sort((firstPlan, secondPlan) => {
            return Number(firstPlan.price) - Number(secondPlan.price);
        });
    }, [plans]);

    const retry = useCallback(() => {
        setReloadKey((currentKey) => currentKey + 1);
    }, []);

    return {
        plans: sortedPlans,
        isLoading,
        errorMessage,
        retry,
    };
}

export default useAvailablePlans;

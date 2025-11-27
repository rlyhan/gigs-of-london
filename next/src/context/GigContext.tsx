import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { Gig } from "@/types";
import { fetchGigs } from "@/helpers/ticketmaster";

interface GigsContextType {
    gigs: Gig[];
    setGigs: Dispatch<SetStateAction<Gig[]>>
    selectedGig: Gig | null;
    setSelectedGig: Dispatch<SetStateAction<Gig | null>>;
    filterDate: Date;
    setFilterDate: Dispatch<SetStateAction<Date>>;
    reloadGigs: () => void;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

const GigsContext = createContext<GigsContextType | undefined>(undefined);

export const GigsProvider = ({
    children,
    initialGigs,
}: {
    children: ReactNode;
    initialGigs: Gig[];
}) => {
    const [gigs, setGigs] = useState<Gig[]>(initialGigs);
    const [loading, setLoading] = useState(false);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [filterDate, setFilterDate] = useState<Date>(new Date());

    const reloadGigs = async () => {
        setLoading(true);
        const fetched = await fetchGigs(filterDate);
        setGigs(fetched);
        setLoading(false);
    };

    useEffect(() => {
        reloadGigs();
    }, [filterDate]);

    return (
        <GigsContext.Provider
            value={{
                gigs,
                setGigs,
                selectedGig,
                setSelectedGig,
                filterDate,
                setFilterDate,
                reloadGigs,
                loading,
                setLoading,
            }}
        >
            {children}
        </GigsContext.Provider>
    );
};


export const useGigs = () => {
    const context = useContext(GigsContext);
    if (!context) throw new Error("useGigs must be used within a GigsProvider");
    return context;
};

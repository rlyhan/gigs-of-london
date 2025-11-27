import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Modal from './modal';
import styles from "./modal.module.scss";
import PillList from "../Lists/pillList";
import SuggestionList from "../Lists/suggestionList";
import LoadingSpinner from "../loading";
import { Gig, GigSuggestion } from "@/types";
import { getGigSuggestions } from "@/helpers/openai";
import { useGigs } from "@/context/GigContext";
import DatePicker from "../Elements/datepicker";

interface SuggestionModalProps {
    open: boolean;
    onClose: () => void; setModalGig: Dispatch<SetStateAction<Gig | null>>;
}

const SuggestionModal = ({ open, onClose, setModalGig }: SuggestionModalProps) => {
    const { gigs, filterDate, setFilterDate } = useGigs();
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<GigSuggestion[]>([]);
    const [suggestionPrompt, setSuggestionPrompt] = useState('');

    const handlePillClick = async (text: string) => {
        setLoading(true);
        setSuggestionPrompt(text);

        const suggestions = await getGigSuggestions(text, gigs);
        setSuggestions(suggestions);

        setLoading(false);
    };

    const handleSuggestionClick = (suggestion: GigSuggestion) => {
        onClose();
        const suggestedGig = gigs.find(gig => gig.id === suggestion.id);
        if (suggestedGig) setModalGig(suggestedGig);
    }

    useEffect(() => {
        console.log('suggestions:', suggestions)
    }, [suggestions])

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className={styles.modal__title}>
                What kind of gig do you fancy tonight?
            </h2>
            <div className={styles.modal__content}>
                <DatePicker date={filterDate} setDate={setFilterDate} />
                {
                    loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {suggestions.length ? (
                                <SuggestionList suggestionPrompt={suggestionPrompt} suggestions={suggestions} handleSuggestionClick={handleSuggestionClick} />
                            ) : (
                                <PillList onSelect={handlePillClick} />
                            )}
                        </>
                    )
                }
            </div>
        </Modal>
    );
};

export default SuggestionModal;
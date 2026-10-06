import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import Modal from './modal';
import styles from "./modal.module.scss";
import PillList from "../Lists/pillList";
import SuggestionList from "../Lists/suggestionList";
import LoadingSpinner from "../loading";
import { Gig, GigSuggestion } from "@/types";
import { getGigSuggestions } from "@/helpers/openai";
import { useGigs } from "@/context/GigContext";
import DatePicker from "../Elements/datepicker";
import { PILL_OPTIONS } from "@/config";

interface SuggestionModalProps {
    open: boolean;
    onClose: () => void; setModalGig: Dispatch<SetStateAction<Gig | null>>;
}

const SuggestionModal = ({ open, onClose, setModalGig }: SuggestionModalProps) => {
    const { gigs, filterDate, setFilterDate } = useGigs();
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<GigSuggestion[]>([]);
    const [suggestionPrompt, setSuggestionPrompt] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handlePillClick = (text: string) => {
        setSuggestionPrompt(text);
    };

    const handleSuggestionClick = (suggestion: GigSuggestion) => {
        onClose();
        const suggestedGig = gigs.find(gig => gig.id === suggestion.id);
        if (suggestedGig) setModalGig(suggestedGig);
    }

    const reloadSuggestions = async (suggestionPrompt: string) => {
        setLoading(true);
        setHasError(false);
        try {
            setSuggestions(await getGigSuggestions(suggestionPrompt, gigs));
        } catch (err) {
            console.error("getGigSuggestions error:", err);
            setSuggestions([]);
            setHasError(true);
        }
        setHasSearched(true);
        setLoading(false);
    };

    const resetSearch = () => {
        setHasSearched(false);
        setHasError(false);
        setSuggestionPrompt('');
    };

    useEffect(() => {
        if (suggestionPrompt) reloadSuggestions(suggestionPrompt);
    }, [suggestionPrompt]);

    return (
        <Modal open={open} onClose={onClose}>
            <div className={styles.modal__header}>
                <h2 className={styles.modal__title} id="modal-title">
                    FIND A GIG.
                </h2>
                <div className={styles.modal__headerDate}>
                    <DatePicker date={filterDate} setDate={setFilterDate} id="modal-datepicker" />
                </div>
            </div>
            <div className={styles.modal__content} style={{ gap: "1.25rem", alignItems: "center" }}>
                {
                    loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {hasError ? (
                                <div className={styles.modal__empty} role="alert">
                                    <h3 className={styles.modal__empty__title}>
                                        Couldn&rsquo;t load suggestions
                                    </h3>
                                    <p className={styles.modal__empty__text}>
                                        Something went wrong finding gigs for &ldquo;{suggestionPrompt}&rdquo;. Try again in a moment.
                                    </p>
                                    <div className={styles.modal__empty__actions}>
                                        <button className={styles.modal__empty__button} onClick={() => reloadSuggestions(suggestionPrompt)}>
                                            Try again
                                        </button>
                                        <button className={styles.modal__empty__buttonSecondary} onClick={resetSearch}>
                                            Back to options
                                        </button>
                                    </div>
                                </div>
                            ) : suggestions.length ? (
                                <SuggestionList suggestionPrompt={suggestionPrompt} suggestions={suggestions} setSuggestionPrompt={setSuggestionPrompt} handleSuggestionClick={handleSuggestionClick} />
                            ) : hasSearched ? (
                                <div className={styles.modal__empty} role="status">
                                    <span className={styles.modal__empty__emoji} aria-hidden="true">
                                        {PILL_OPTIONS.find(option => option.label === suggestionPrompt)?.emoji}
                                    </span>
                                    <h3 className={styles.modal__empty__title}>
                                        No gigs match &ldquo;{suggestionPrompt}&rdquo; on this date
                                    </h3>
                                    <p className={styles.modal__empty__text}>
                                        Pick another vibe or change the date.
                                    </p>
                                    <button className={styles.modal__empty__button} onClick={resetSearch}>
                                        Back to options
                                    </button>
                                </div>
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
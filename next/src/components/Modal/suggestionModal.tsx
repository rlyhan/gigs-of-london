import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Modal from './modal';
import styles from "./modal.module.scss";
import PillList from "../Lists/pillList";
import SuggestionList from "../Lists/suggestionList";
import LoadingSpinner from "../loading";
import { Gig } from "@/types";

interface SuggestionModalProps {
    open: boolean;
    onClose: () => void;
    gigs: Gig[];
    setModalGigId: Dispatch<SetStateAction<string | null>>;
}

const SuggestionModal = ({ open, onClose, gigs, setModalGigId }: SuggestionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionPrompt, setSuggestionPrompt] = useState('');

    const handlePillClick = async (text: string) => {
        setLoading(true);
        setSuggestionPrompt(text);
        try {
            const validGigs = gigs.filter((gig: Gig) => gig.name && gig.name.trim() !== "");
            if (validGigs.length === 0) {
                console.warn("No valid gigs with a name to send to the API.");
                setLoading(false);
                return;
            }
            const res = await fetch("/api/openai/classify-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    gigs: validGigs.map((gig: Gig) => ({ name: gig.name, id: gig.id }))
                }),
            });
            const data = await res.json();
            setSuggestions(data.suggestions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestionId: string) => {
        onClose();
        setModalGigId(suggestionId);
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
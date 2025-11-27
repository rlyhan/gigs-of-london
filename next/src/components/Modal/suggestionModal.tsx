import React, { useState, useEffect } from "react";
import Modal from './modal';
import styles from "./modal.module.scss";
import LoadingSpinner from "../loading";
import { PILL_OPTIONS } from "@/config";

interface SuggestionModalProps {
    open: boolean;
    onClose: () => void;
    gigs: [];
}

const SuggestionModal = ({ open, onClose, gigs }: SuggestionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const handlePillClick = async (text: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/openai/classify-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    gigs: gigs.map((gig) => ({ name: gig.name, id: gig.id }))
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
                                <div>
                                    {suggestions.map((suggestion) => (
                                        <div>
                                            <span>{suggestion.name}</span>
                                            <span>{suggestion.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.modal__pill_list}>
                                    {PILL_OPTIONS.map((pill) => (
                                        <div className={styles.modal__pill} onClick={() => handlePillClick(pill.label)}>{pill.label}</div>
                                    ))}
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </Modal>
    );
};

export default SuggestionModal;
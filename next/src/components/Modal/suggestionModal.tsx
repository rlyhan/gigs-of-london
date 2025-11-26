import React, { Dispatch, SetStateAction } from "react";
import Modal from './modal';
import styles from "./modal.module.scss";

interface SuggestionModalProps {
    open: boolean;
    onClose: () => void;
}

const SuggestionModal = ({ open, onClose }: SuggestionModalProps) => {
    return (
        <Modal open={open} onClose={onClose}>
            <h2 className={styles.modal__title}>
                What kind of gig do you fancy tonight?
            </h2>
            <div className={styles.modal__content}>
            </div>
        </Modal>
    );
};

export default SuggestionModal;
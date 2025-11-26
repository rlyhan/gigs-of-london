import React, { ReactNode } from "react";
import styles from "./modal.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, onClose, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} onClick={onClose} />

      <div className={styles.modal}>
        <button
          className={styles.modal__closeBtn}
          onClick={onClose}
          type="button"
        >
          <div className={styles.modal__closeBtn__icon}>X</div>
        </button>

        <div className={styles.modal__wrap}>{children}</div>
      </div>
    </div >
  );
};

export default Modal;

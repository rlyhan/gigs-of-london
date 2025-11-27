import React, { Dispatch, SetStateAction } from "react";
import moment from "moment";
import { Gig } from "@/types";
import Modal from './modal';
import styles from "./modal.module.scss";
import utilsStyles from "../../styles/utils.module.scss";
import {
    filterImagesByAspectRatio,
    findLargestImage,
} from "../../helpers/filters";

interface EventModalProps {
    gig: Gig;
    setModalGigId: Dispatch<SetStateAction<string | null>>;
}

const EventModal = ({ gig, setModalGigId }: EventModalProps) => {
    const onClose = () => setModalGigId(null);
    if (!gig) return null;

    return (
        <Modal open={!!gig} onClose={onClose}>
            <div className={utilsStyles.aspectRatioImage}>
                <p className={styles.modal__gigTitle}>{gig.name}</p>

                <div className={utilsStyles.aspectRatioImage__imgWrapLarge}>
                    <img
                        className={utilsStyles.aspectRatioImage__img}
                        src={
                            findLargestImage(
                                filterImagesByAspectRatio(gig.images, "3_2")
                            ).url
                        }
                    />
                </div>
            </div>

            <div className={styles.modal__content}>
                <div className={styles.modal__content__flexWrapper}>
                    <p className={styles.modal__content__text}>
                        {gig._embedded?.venues[0]?.name}
                        <br />
                        {moment(gig.dates.start.localDate).format("MMMM Do YYYY")},{" "}
                        {moment(gig.dates.start.localTime, "HH:mm:ss").format("h:mm A")}
                    </p>

                    <div className={styles.modal__content__buyBtn}>
                        <a
                            className={styles.modal__content__buyBtn__link}
                            href={gig.url}
                            target="__blank"
                        >
                            Purchase tickets
                        </a>
                    </div>
                </div>

                {gig.info && (
                    <>
                        <p className={styles.modal__content__text__description__heading}>
                            About this event
                        </p>
                        <p className={styles.modal__content__text__description}>{gig.info}</p>
                    </>
                )}

                {gig.pleaseNote && (
                    <>
                        <p className={styles.modal__content__text__description__heading}>
                            Please note
                        </p>
                        <p className={styles.modal__content__text__description}>
                            {gig.pleaseNote}
                        </p>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default EventModal;

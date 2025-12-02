import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import moment from "moment";
import { Gig, GigImage } from "@/types";
import Modal from './modal';
import styles from "./modal.module.scss";
import utilsStyles from "../../styles/utils.module.scss";
import {
    filterImagesByAspectRatio,
    findLargestImage,
} from "../../helpers/filters";

interface EventModalProps {
    gig: Gig;
    setModalGig: Dispatch<SetStateAction<Gig | null>>;
}

const EventModal = ({ gig, setModalGig }: EventModalProps) => {
    const onClose = () => setModalGig(null);
    if (!gig) return null;

    const eventImages: GigImage[] = filterImagesByAspectRatio(gig.images, "3_2") ?? [];
    const largestImage = findLargestImage(eventImages);
    const modalImageUrl = largestImage?.url;

    return (
        <Modal open={!!gig} onClose={onClose}>
            <div className={utilsStyles.aspectRatioImage}>
                <h2 className={styles.modal__gigTitle} id="modal-title">{gig.name}</h2>

                {modalImageUrl && <div className={utilsStyles.aspectRatioImage__imgWrapLarge}>
                    <Image
                        className={utilsStyles.aspectRatioImage__img}
                        src={
                            modalImageUrl
                        }
                        alt={gig.name}
                        width={800}
                        height={560}
                    />
                </div>}
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

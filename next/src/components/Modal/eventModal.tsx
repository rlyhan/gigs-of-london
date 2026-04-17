import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
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
import { getGigDescription } from "../../helpers/openai";
import AiSummaryCard from "../AiSummaryCard/aiSummaryCard";
import { MapPinIcon, CalendarIcon } from "../Icons/icons";

interface EventModalProps {
    gig: Gig;
    setModalGig: Dispatch<SetStateAction<Gig | null>>;
}

const descriptionCache: Record<string, string> = {};

const FALLBACK_TEXT = "Could not generate details of the event - go to the event page to learn more.";

const EventModal = ({ gig, setModalGig }: EventModalProps) => {
    const onClose = () => setModalGig(null);
    const [aiDescription, setAiDescription] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiFailed, setAiFailed] = useState(false);
    const fetchAttempts = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!gig) return;

        // Reset state for new gig
        setAiDescription(null);
        setAiLoading(false);
        setAiFailed(false);

        // Check cache first
        if (descriptionCache[gig.id]) {
            setAiDescription(descriptionCache[gig.id]);
            return;
        }

        // Allow one retry (max 2 attempts)
        const attempts = fetchAttempts.current[gig.id] || 0;
        if (attempts >= 2) {
            setAiFailed(true);
            return;
        }
        fetchAttempts.current[gig.id] = attempts + 1;

        setAiLoading(true);
        getGigDescription(gig).then((description) => {
            if (description) {
                descriptionCache[gig.id] = description;
                setAiDescription(description);
            } else {
                setAiFailed(true);
            }
            setAiLoading(false);
        });
    }, [gig]);

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
                    <div className={styles.modal__content__details}>
                        {gig._embedded?.venues[0]?.name && (
                            <div className={styles.modal__content__detailRow}>
                                <MapPinIcon className={styles.modal__content__detailIcon} />
                                <span>{gig._embedded.venues[0].name}</span>
                            </div>
                        )}
                        <div className={styles.modal__content__detailRow}>
                            <CalendarIcon className={styles.modal__content__detailIcon} />
                            <span>
                                {moment(gig.dates.start.localDate).format("MMMM Do YYYY")}
                                {gig.dates.start.localTime && (
                                    <>{", "}{moment(gig.dates.start.localTime, "HH:mm:ss").format("h:mm A")}</>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles.modal__content__buyBtn}>
                        <a
                            className={styles.modal__content__buyBtn__link}
                            href={gig.url}
                            target="__blank"
                        >
                            Get tickets
                        </a>
                    </div>
                </div>

                <div className={styles.border} />

                <AiSummaryCard
                    description={aiDescription}
                    loading={aiLoading}
                    failed={aiFailed}
                    fallbackText={FALLBACK_TEXT}
                />

                <div style={{ marginTop: "1em" }}>
                    {gig.info && (
                        <p className={styles.modal__content__text__secondary}>{gig.info}</p>
                    )}

                    {gig.pleaseNote && (
                        <p className={styles.modal__content__text__secondary}>
                            Please note: {gig.pleaseNote}
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default EventModal;

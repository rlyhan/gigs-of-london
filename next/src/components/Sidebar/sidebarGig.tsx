import Image from "next/image";
import moment from "moment";
import { Gig } from "@/types";
import styles from "./sidebar.module.scss";
import utilsStyles from "../../styles/utils.module.scss";
import {
    filterImagesByAspectRatio,
    findLargestImage,
} from "../../helpers/filters";

export type SidebarGigProps = {
    gig: Gig;
    handleMouseClick: (gig: Gig) => void;
    handleMouseEnter: (gig: Gig) => void;
    handleMouseLeave: () => void;
}

const SidebarGig = ({ gig, handleMouseClick, handleMouseEnter, handleMouseLeave }: SidebarGigProps) => {
    const landscapeImages = filterImagesByAspectRatio(gig.images, "3_2") ?? [];
    const largestLandscapeThumbnail = findLargestImage(landscapeImages, 650)
    const largestLandscapeThumbnailUrl = largestLandscapeThumbnail?.url;
    return (
        <button
            key={gig.id}
            className={styles.sidebar__gigList__gig}
            onClick={() => handleMouseClick(gig)}
            onMouseEnter={() => handleMouseEnter(gig)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => handleMouseEnter(gig)}
            onBlur={handleMouseLeave}
            aria-label={`View details for ${gig.name} at ${gig._embedded?.venues[0]?.name} on ${moment(gig.dates.start.localDate).format("MMMM Do YYYY")
                }`}
        >
            <div className={utilsStyles.aspectRatioImage}>
                <div className={styles.sidebar__gigList__gig__title}>
                    <p className={styles.sidebar__gigList__gig__title__text}>
                        {gig.name}
                    </p>
                </div>
                <div className={utilsStyles.aspectRatioImage__imgWrap}>
                    {largestLandscapeThumbnailUrl && <Image
                        className={utilsStyles.aspectRatioImage__img}
                        src={largestLandscapeThumbnailUrl}
                        alt={gig.name}
                        width={430}
                        height={172}
                        quality={100}
                        loading="lazy"
                    />}
                </div>
            </div>
            <div className={styles.sidebar__gigList__gig__desc}>
                <p className={styles.sidebar__gigList__gig__desc__text}>
                    {gig._embedded?.venues[0]?.name}
                </p>
                <p className={styles.sidebar__gigList__gig__desc__text}>
                    {moment(gig.dates.start.localDate).format("MMMM Do YYYY")}
                    {gig.dates.start.localTime &&
                        `, ${moment(gig.dates.start.localTime, "HH:mm:ss").format(
                            "h:mm A"
                        )}`}
                </p>
            </div>
        </button>
    );
}
export default SidebarGig;
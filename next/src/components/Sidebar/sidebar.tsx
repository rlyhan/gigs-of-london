import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import cn from "classnames";
import styles from "./sidebar.module.scss";
import DatePicker from "../Elements/datepicker";
import { useGigs } from "@/context/GigContext"
import { Gig } from "@/types";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import Logo from "../logo";
import SidebarGig from "./sidebarGig";

interface SidebarProps {
  setModalGig: Dispatch<SetStateAction<Gig | null>>;
  setShowSuggestionModal: Dispatch<SetStateAction<boolean>>;
}

export const Sidebar = ({
  setModalGig,
  setShowSuggestionModal
}: SidebarProps) => {
  const isPhone = useBreakpoint("phone");
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(true);
  const { gigs, setSelectedGig, filterDate, setFilterDate, loading } = useGigs();

  const handleMouseClick = (gig: Gig) => {
    setModalGig(gig);
  };

  const handleMouseEnter = (gig: Gig) => {
    setSelectedGig(gig);
  };

  const handleMouseLeave = () => {
    setSelectedGig(null);
  };

  const toggleSidebar = () => {
    setMobileSidebarVisible(prev => !prev);
  };

  const shouldShowSidebar = (() => {
    if (isPhone === undefined) {
      return true;
    }
    return isPhone ? mobileSidebarVisible : true;
  })();

  useEffect(() => {
    if (isPhone === undefined) return;
    setMobileSidebarVisible(prev => prev ?? true);
  }, [isPhone]);


  return (
    <div className={styles.sidebar} id="sidebar">
      <div className={styles.sidebar__top} id="sidebar-top">
        <Logo />
        <div className={styles.sidebar__topContent}>
          <DatePicker date={filterDate} setDate={setFilterDate} id="sidebar-datepicker" useCalendarIcon />
          {isPhone &&
            <button className={cn("roundIcon", styles.sidebar__mobileCollapse, {
              [styles.collapsed]: mobileSidebarVisible
            })}
              aria-label="Collapse sidebar"
              onClick={toggleSidebar}>
              <span />
            </button>
          }
        </div>
      </div>
      {shouldShowSidebar &&
        <>
          <div className={styles.sidebar__gigList}>
            {loading ?
              (
                <p className={styles.sidebar__sidebarMessage}>Loading...</p>
              ) :
              <>
                {gigs?.length ? (
                  gigs.map((gig) => (
                    <SidebarGig
                      key={gig.id}
                      gig={gig}
                      handleMouseClick={handleMouseClick}
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                    />
                  ))
                ) : (
                  <p className={styles.sidebar__sidebarMessage}>{`No events on this day :(`}</p>
                )}
              </>
            }
          </div>
          <button className={styles.sidebar__suggestionModalPrompt} onClick={() => setShowSuggestionModal(true)} aria-label="Get gig suggestions">
            <span>I need ideas...</span>
          </button>
        </>
      }
    </div>
  );
};

export default Sidebar;

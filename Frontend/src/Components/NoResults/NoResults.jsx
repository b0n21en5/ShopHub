import React from "react";
import noResults from "../../assets/no-search-results.png";

import styles from "./NoResults.module.css";

const NoResults = () => {
  return (
    <div className={styles.no_results}>
      <img width="286" height="184" src={noResults} alt="no-results-found" />
      <div className={styles.txt_bld}>Sorry, no results found!</div>
      <div className={styles.txt_gry}>
        Please check the spelling or try searching for something else
      </div>
    </div>
  );
};

export default NoResults;

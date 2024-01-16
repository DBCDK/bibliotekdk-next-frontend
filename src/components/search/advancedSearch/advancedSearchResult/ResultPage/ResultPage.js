import PropTypes from "prop-types";
import ResultRow from "@/components/search/result/row";
//import { ResultPage } from "@/components/search/result/page";

import { Fragment } from "react";
import { useData } from "@/lib/api/api";
import SearchFeedBack from "@/components/base/searchfeedback";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";


//import styles from "./AdvancedSearch.module.css";

import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import { isEmpty } from "lodash";

/**
 * Row representation of a search result entry
 *
 * @param {Object} props
 * See propTypes for specific props and types
 */
export function ResultPage({ rows, onWorkClick, isLoading }) {
  if (isLoading) {
    // Create some skeleton rows
    rows = Array(10).fill({});
  }

  const resultRows = rows?.map((row, index) => (
    <Fragment key={row.workId + ":" + index}>
      <ResultRow
        isLoading={isLoading}
        work={row}
        key={`${row?.titles?.main}_${index}`}
        onClick={onWorkClick && (() => onWorkClick(index, row))}
      />
      {index === 0 && <SearchFeedBack />}
    </Fragment>
  ));

  if (!rows) {
    return null;
  }

  return <>{resultRows}</>;
}

ResultPage.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  onWorkClick: PropTypes.func,
};
function parseResponse(bigResponse) {
    return {
      works: bigResponse?.data?.complexSearch?.works || null,
      hitcount: bigResponse?.data?.complexSearch?.hitcount || 0,
      errorMessage: bigResponse?.data?.complexSearch?.errorMessage || null,
      isLoading: bigResponse?.isLoading,
    };
  }
/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({  onWorkClick,page }) {

    //rows, onWorkClick, isLoading
    const {
        cqlFromUrl: cql,
        fieldSearchFromUrl: fieldSearch,
       // pageNoFromUrl: pageNo,
        sort,
        setShowPopover,
      } = useAdvancedSearchContext();
    
      // we  disable the data collect for now - this one is propdrilled from
      // components/search/result/page
      // @TODO what to do  with dataCollect ???
      onWorkClick = null;
      // get setter for advanced search history
      const { setValue } = useAdvancedSearchHistory();
      const limit = 10; // limit
      let offset = limit * (page - 1); // offset
      const cqlQuery = cql || convertStateToCql(fieldSearch);
    
      const showResult = !isEmpty(fieldSearch) || !isEmpty(cql);
    
      // use the useData hook to fetch data
      const bigResponse = useData(
        doComplexSearchAll({
          cql: cqlQuery,
          offset: offset,
          limit: limit,
          ...(!isEmpty(sort) && { sort: sort }),
        })
      );
      const parsedResponse = parseResponse(bigResponse);
    
    //   if (parsedResponse.isLoading) {
    //     return (
    //       <>
    //         <TopBar />
    
    //         <Section
    //           divider={false}
    //           colSize={{ lg: { offset: 1, span: true } }}
    //           title="loading ..."
    //           subtitle=""
    //           isLoading={true}
    //         >
    //           <AdvancedSearchSort
    //         //    className={cx(styles.sort_container, styles.loadingSort)}
    //             skeleton={true}
    //           />
    //           <ResultPage isLoading={true} />
    //         </Section>
    //       </>
    //     );
    //   }
      //update searchhistory
      if (!parsedResponse?.errorMessage && !parsedResponse.isLoading) {
        // make an object for searchhistory @TODO .. the right object please
        const searchHistoryObj = {
          hitcount: parsedResponse?.hitcount,
          fieldSearch: fieldSearch || "",
          cql: cqlQuery,
        };
        setValue(searchHistoryObj);
      }
    
      if (!showResult) {
        return null;
      }
    
  return <ResultPage                
  rows={parsedResponse?.works}
  onWorkClick={onWorkClick}
  isLoading={parsedResponse?.isLoading} />;
}
Wrap.propTypes = {
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};

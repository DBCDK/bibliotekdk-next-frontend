import { useData } from "@/lib/api/api";
import * as complexSearchFragments from "@/lib/api/complexSearch.fragments";
import { Slider } from "@/components/inspiration/slider/Slider";

/**
 * MAP - a key to a slider and a value for the cql to get the data
 * @type {{politiken: string}}
 */
const MAP = {
  pub_newest_politiken:
    '((worktype=article)) AND (term.hostpublication="politiken")',
  pub_newest_berlingske_tidende:
    '((worktype=article)) AND (term.hostpublication="berlingske tidende")',
  pub_newest_jyllands_posten:
    '((worktype=article)) AND (term.hostpublication="jyllands-posten")',
};

/**
 * Article slider is a(nother) wrapper for <Slider> @see @/components/inspiration/slider/Slider
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ArticleSlider({ props }) {
  const { filters } = props;
  const key = filters[0].subCategories[0];
  const cql = MAP[key];
  // we always sort by newest first
  const sort = { index: "sort.latestpublicationdate", order: "desc" };

  const { data, isLoading } = useData(
    cql &&
      complexSearchFragments.ComplexArticleSlider({
        cql: cql,
        offset: 0,
        limit: 30,
        sort: sort,
      })
  );
  return (
    <Slider
      data={data?.complexSearch?.works}
      isLoading={isLoading}
      lazyLoad={true}
      {...props}
    />
  );
}

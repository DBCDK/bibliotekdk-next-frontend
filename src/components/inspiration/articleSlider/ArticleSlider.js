import { useData } from "@/lib/api/api";
import * as complexSearchFragments from "@/lib/api/complexSearch.fragments";
import { Slider } from "@/components/inspiration/slider/Slider";

/**
 * MAP - a key to a slider and a value for the cql to get the data from complex search
 * @type {{politiken: string}}
 */
const MAP = {
  // pub_newest_politiken:
  //   '((worktype=article)) AND (term.hostpublication="politiken")',
  // pub_newest_berlingske_tidende:
  //   '((worktype=article)) AND (term.hostpublication="berlingske tidende")',
  // pub_newest_jyllands_posten:
  //   '((worktype=article)) AND (term.hostpublication="jyllands-posten")',
  // pub_newest_information:
  //   '((worktype=article)) AND (term.hostpublication="information")',
  // pub_newest_kristeligt_dagblad:
  //   '((worktype=article)) AND (term.hostpublication="kristeligt dagblad")',
  sub_newest_politics:
    '((worktype=article)) AND ((term.subject="politiske forhold"))',
  sub_newest_technology:
    '((worktype=article)) AND ((term.subject="teknologi"))',
  sub_newest_climate: '((worktype=article)) AND ((term.subject="klima"))',
  sub_newest_health: '((worktype=article)) AND ((term.subject="sundhed"))',
  sub_newest_nutrition: '((worktype=article)) AND ((term.subject="ernæring"))',
  sub_newest_fashion: '((worktype=article)) AND ((term.subject="mode"))',
  sub_newest_housing: '((worktype=article)) AND ((term.subject="bolig"))',
  sub_newest_movie: '((worktype=article)) AND ((term.subject="film"))',
  sub_newest_music: '((worktype=article)) AND ((term.subject="musik"))',
  sub_newest_theater: '((worktype=article)) AND ((term.subject="teater"))',
  sub_newest_astronomy: '((worktype=article)) AND ((term.subject="astronomi"))',
  sub_newest_psychology:
    '((worktype=article)) AND ((term.subject="psykologi"))',
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

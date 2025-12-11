import Header from "@/components/header/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import Publications from "@/components/creator/publications";
import Overview from "@/components/creator/Overview";
import Subjects from "@/components/creator/Subjects";
import Favorites from "@/components/creator/Favorites";
import { useCreatorOverview } from "@/components/creator/Overview";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { creatorOverview } from "@/lib/api/creator.fragments";
import Custom404 from "@/pages/404";

export default function CreatorPage() {
  const router = useRouter();
  const { creatorId } = router.query;
  const { canonical, alternate } = useCanonicalUrl();
  const { data, isLoading } = useCreatorOverview(creatorId);

  // Return 404 page if no works are found for the creator
  if (!isLoading && !data?.generated?.dataSummary?.text) {
    return <Custom404 />;
  }

  const title = creatorId;
  const description =
    data?.generated?.shortSummary?.text ||
    data?.generated?.dataSummary?.text ||
    "Se værker og udgivelser relateret til denne person.";
  const imageUrl = data?.image?.url;
  console.log("description", description);
  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:url" property="og:url" content={canonical.url} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        {imageUrl && (
          <meta key="og:image" property="og:image" content={`${imageUrl}`} />
        )}
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>

      <Header router={router} />
      <Overview creatorId={creatorId} />

      <Subjects creatorId={creatorId} />

      <Favorites creatorId={creatorId} />

      <Publications creatorId={creatorId} />
    </>
  );
}
CreatorPage.getInitialProps = async (ctx) => {
  const init = await fetchAll(
    [creatorOverview],
    ctx,
    { display: ctx.query.creatorId },
    true
  );
  const queries = Object.values(init.initialData);
  // Check if creator exists
  if (!queries[0]?.data?.creatorByDisplay?.generated?.dataSummary?.text) {
    if (ctx.res) {
      ctx.res.statusCode = 404;
    }
  }

  return init;
};

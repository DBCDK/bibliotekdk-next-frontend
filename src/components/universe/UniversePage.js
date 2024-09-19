import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import * as universeFragments from "@/lib/api/universe.fragments";
import Custom404 from "@/pages/404";
import UniverseHeading from "@/components/universe/universeHeading/UniverseHeading";
import UniverseMembers from "@/components/universe/universeMembers/UniverseMembers";
import Head from "next/head";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

export default function UniversePage() {
  const router = useRouter();

  const { universeId } = router.query;

  const { data, error } = useData(
    universeId && universeFragments.universeBasicInfo({ universeId })
  );
  const { canonical, alternate } = useCanonicalUrl();
  const title = data?.universe?.title;
  const description = data?.universe?.description;

  if (error || (data && !data?.universe)) {
    return <Custom404 />;
  }

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
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>
      <Header router={router} />
      <main>
        <UniverseHeading universeId={universeId} />
        <UniverseMembers universeId={universeId} />
      </main>
    </>
  );
}

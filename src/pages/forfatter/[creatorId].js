import Header from "@/components/header/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import Publications from "@/components/creator/publications";

export default function CreatorPage() {
  const router = useRouter();
  const { creatorId } = router.query;
  const { canonical, alternate } = useCanonicalUrl();

  return (
    <>
      <Head>
        <title key="title">Forfatterside jatak</title>
        <meta key="description" name="description" content={"description"} />
        <meta key="og:url" property="og:url" content={canonical.url} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={"title"} />
        <meta
          key="og:description"
          property="og:description"
          content={"description"}
        />
        {/* {imgUrl && (
          <meta key="og:image" property="og:image" content={`${imgUrl}`} />
        )} */}
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>

      <Header router={router} />
      <div
        style={{
          padding: "var(--pt2)",
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 1000 }}>
          Hej her er forfattersiden for <b>{creatorId}</b>
        </div>
      </div>

      <Publications creatorId={creatorId} />
    </>
  );
}

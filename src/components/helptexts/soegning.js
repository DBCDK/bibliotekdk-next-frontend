import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Head from "next/head";

import Header from "@/components/header";
import Section from "@/components/base/section";

import styles from "./helptexts.module.css";

export default function Soegning() {
  return (
    <>
      <Header />
      <Head>
        <title key="title">Søgning hjælp</title>
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Søgning hjælp" />
      </Head>
      <Section
        title={<span />}
        backgroundColor={"var(--white)"}
        space={{ top: "var(--pt4)", bottom: "var(--pt4)" }}
      >
        <div data-cy="help-text-body">
          <Title
            tag="h1"
            type="title2"
            style={{ marginBottom: "12px", marginTop: "24px" }}
          >
            Søgning i StudieSøg
          </Title>
          <Text type="text3" dataCy="advanced-search-description">
            StudieSøg tilbyder to former for søgning:
          </Text>
          <Text type="text3" tag="span">
            <strong>Feltsøgning, </strong>
            hvor du udfylder felter med søgeord
          </Text>
          <br />
          <Text type="text3" tag="span">
            <strong>Søgning med søgekoder, </strong>
            hvor du ved hjælp af søgekoder selv sammensætter din søgning. Her
            bruger du et særligt søgesprog, CQL.
          </Text>
          <Title
            tag="h2"
            type="title4"
            style={{ marginBottom: "12px", marginTop: "24px" }}
          >
            Feltsøgning
          </Title>
          <Text type="text3" dataCy="field-search-description">
            Du kan søge ved at bruge feltsøgningen, hvor du sammensætter
            søgningen ved hjælp af felter, der bindes sammen af operatorerne OG,
            ELLER, IKKE.
          </Text>
          <Text type="text3" dataCy="field-search-instructions">
            Brug desuden dropdown-boksene nederst på siden til at afgrænse din
            søgning til et bestemt tidsinterval, et bestemt sprog, materialetype
            og aldersgruppe. Her kan du også vælge, om NOTAs materialer skal
            være med i din søgning.
          </Text>

          <Title
            tag="h2"
            type="title4"
            style={{ marginBottom: "12px", marginTop: "24px" }}
          >
            Trunkering
          </Title>
          <Text type="text3" dataCy="truncation-description">
            Hvis du ikke er helt sikker på endelsen af dit søgeord eller bare
            gerne vil søge bredt, kan du trunkere dit søgeord med en asterisk *.
            Når man trunkerer, søger man på ordets start og en hvilken som helst
            endelse. Det vil sige, at søgning på <strong>klima*</strong> søger
            på alle ord, der starter med <strong>klima</strong>:
            Klimaforandringer, klimapolitik, klimaforskning osv.
          </Text>

          <Title
            tag="h2"
            type="title4"
            style={{ marginBottom: "12px", marginTop: "24px" }}
          >
            Kommandosøgning
          </Title>
          <Text type="text3" dataCy="command-search-description">
            Du kan også søge med søgekoder. Klik på Rediger som CQL.
          </Text>

          <ul>
            <li>{'term.subject=epigenetik and term.creator="ida donkin"'}</li>
            <li>{'term.title="pussy riot" and worktype=movie'}</li>
            <li>
              {
                ' term.subject="aktiv dødshjælp" AND phrase.generalmaterialtype="artikler"'
              }
            </li>
          </ul>

          <Text
            type="text3"
            className={styles.warning}
            style={{ marginBottom: "46px" }}
          >
            <strong>Vær opmærksom på</strong>, at hvis du vælger at redigere din
            feltsøgning i CQL, kan du ikke gå tilbage til feltsøgning igen.
          </Text>
          <table className={styles.tableexamples}>
            <thead>
              <tr>
                <th>
                  <Text type="text4">Søgekoder</Text>
                </th>
                <th>
                  <Text type="text4">Eksempler</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <Text type="text4">dk5</Text>
                </th>
                <td>
                  <Text type="text3">{'dk5="85"'}</Text>

                  <Text type="text3">{'dk5="79.62"'}</Text>
                </td>
              </tr>
              <tr>
                <th>
                  <Text type="text4">let</Text>
                </th>
                <td>
                  <Text type="text3">{'let="12"'}</Text>
                </td>
              </tr>
              <tr>
                <th>
                  <Text type="text4">lix</Text>
                </th>
                <td>
                  <Text type="text3">{'lix="28"'}</Text>
                </td>
              </tr>
              <tr>
                <th>
                  <Text type="text4">publicationyear</Text>
                </th>
                <td>
                  <Text type="text3">{'publicationyear="2020"'}</Text>

                  <Text type="text3">
                    {'publicationyear within "2020 2019"'}
                  </Text>

                  <Text type="text3">publicationyear &gt; 2021</Text>

                  <Text type="text3">publicationyear &gt;= 2021</Text>

                  <Text type="text3">publicationyear &lt; 1984</Text>

                  <Text type="text3">publicationyear &lt;= 1984</Text>
                </td>
              </tr>
              <tr>
                <th>
                  <Text type="text4">worktype</Text>
                </th>
                <td>
                  <Text type="text3">{'worktype="article"'}</Text>
                </td>
              </tr>
              <tr>
                <th>
                  <Text type="text4">phrase.cataloguecode</Text>
                </th>
                <td>
                  <Text type="text3">{'phrase.cataloguecode="BKM202310"'}</Text>
                </td>
              </tr>
              <tr>
                <th>
                  <Text type="text4">phrase.contributor</Text>
                </th>
                <td>
                  <Text type="text3">
                    {'phrase.contributor="charlie chaplin"'}
                  </Text>
                </td>
              </tr>
              {/* Add other rows as needed */}
            </tbody>
          </table>
          <Text
            type="text3"
            dataCy="search-codes-link"
            style={{ marginTop: "16px" }}
          >
            Har du brug for alle søgekoder? Så se her:
            <a
              href="https://fbi-api.dbc.dk/indexmapper/"
              className={styles.link}
            >
              Alle søgekoder
            </a>
          </Text>
        </div>
      </Section>
    </>
  );
}

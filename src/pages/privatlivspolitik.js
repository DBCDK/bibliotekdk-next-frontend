/**
 * @file this is the page for privacy policy
 */
import Head from "next/head";

import Header from "@/components/header/Header";
import Section from "@/components/base/section";
import BodyParser from "@/components/base/bodyparser";

const txtBody =
  "<ul>\n" +
  "                <li>Privatlivspolitik generelt</li>\n" +
  "                <li>\n" +
  "                  Oplysninger om dig selv (navn, CPR-nummer, mailadresse m.m.)\n" +
  "                </li>\n" +
  "                <li>Kryptering og sikkerhedsbevis</li>\n" +
  "                <li>Hvad gemmes hvor?</li>\n" +
  "                <li>Dine rettigheder</li>\n" +
  "              </ul>\n" +
  "\n" +
  "              <p>&nbsp;</p>\n" +
  "\n" +
  "              <h2>Privatlivspolitik generelt</h2>\n" +
  "\n" +
  "              <p>\n" +
  "                Her kan du finde forklaring på, hvordan Bibliotek.dk og\n" +
  "                bibliotekerne bruger de oplysninger om dig, som vi får, mens du\n" +
  "                bruger Bibliotek.dk.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Har du spørgsmål til privatlivspolitikken, er du altid velkommen\n" +
  "                til at kontakte vores Kundeservice eller spørge på dit lokale\n" +
  "                bibliotek, hvis det drejer sig om bibliotekets anvendelse af\n" +
  "                dine oplysninger.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Du kan bruge Bibliotek.dk og være helt anonym, men hvis du\n" +
  "                bestiller eller bruger mange andre funktioner, afgiver du\n" +
  "                forskellige oplysninger, som skal bruges i det videre forløb.\n" +
  "                <br />\n" +
  "                Læs her mere om, hvilke data der bruges og hvordan:\n" +
  "                <br />\n" +
  "                &nbsp;\n" +
  "              </p>\n" +
  "\n" +
  "              <h2>\n" +
  "                Oplysninger om dig selv (navn, CPR-nummer, mailadresse m.m.)\n" +
  "              </h2>\n" +
  "\n" +
  "              <p>\n" +
  "                Når du bestiller via Bibliotek.dk, krypteres dine oplysninger.\n" +
  "                Det betyder, at de ikke kan opsnappes og misbruges af andre, og\n" +
  "                de kan kun læses af afsender og modtager. I nogle tilfælde\n" +
  "                viderestilles du til dit lokale bibliotek – så har biblioteket\n" +
  "                ansvaret for at håndtere de oplysninger, du afgiver på deres\n" +
  "                websted.\n" +
  "                <br />\n" +
  "                Når du bestiller materiale via Bibliotek.dk, gemmes oplysninger\n" +
  "                to steder:\n" +
  "              </p>\n" +
  "\n" +
  "              <ul>\n" +
  "                <li>I en database med bestillinger på DBC Digital</li>\n" +
  "                <li>\n" +
  "                  Lokalt hos det bibliotek der skal behandle bestillingen.\n" +
  "                </li>\n" +
  "              </ul>\n" +
  "\n" +
  "              <p>\n" +
  "                <br />\n" +
  "                I begge tilfælde behandles oplysningerne strengt fortroligt.\n" +
  "                Bibliotekernes personale har tavshedspligt med hensyn til\n" +
  "                oplysninger angående din brug af biblioteket.\n" +
  "                <br />\n" +
  "                &nbsp;\n" +
  "              </p>\n" +
  "\n" +
  "              <h2>Kryptering og sikkerhedsbevis</h2>\n" +
  "\n" +
  "              <p>\n" +
  "                Når du sender persondata via Bibliotek.dk, krypteres\n" +
  "                oplysningerne så kun du og modtageren kan læse dem.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Bibliotek.dk bruger en sikkerhedsprotokol (TLS - Transport Layer\n" +
  "                Security) der sørger for en sikker forbindelse mellem dig som\n" +
  "                bruger af Bibliotek.dk og DBC Digital, der afvikler\n" +
  "                Bibliotek.dk.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>En sikker forbindelse garanterer:</p>\n" +
  "\n" +
  "              <ul>\n" +
  "                <li>\n" +
  "                  at data er som du afsender dem - de kan ikke ændres under\n" +
  "                  transmissionen\n" +
  "                </li>\n" +
  "                <li>\n" +
  "                  at data kan hemmeligholdes så andre ikke kan se indholdet af\n" +
  "                  det sendte.\n" +
  "                </li>\n" +
  "              </ul>\n" +
  "\n" +
  "              <p>\n" +
  "                <br />\n" +
  "                TLS-funktionen ligger i din browser. Den aktiveres automatisk,\n" +
  "                når du indtaster personlige oplysninger i forbindelse med\n" +
  "                bestilling.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                <strong>\n" +
  "                  Du skal ikke installere noget ekstra software for at kunne\n" +
  "                  bruge Bibliotek.dk sikkert.\n" +
  "                </strong>\n" +
  "                <br />\n" +
  "                &nbsp;\n" +
  "              </p>\n" +
  "\n" +
  "              <h2>Hvad gemmes hvor?</h2>\n" +
  "\n" +
  "              <p>Disse oplysninger gemmes af Bibliotek.dk (på DBC Digital):</p>\n" +
  "\n" +
  "              <ul>\n" +
  "                <li>bestillingsoplysninger.</li>\n" +
  "                <li>statistik om brug af Bibliotek.dk (uden persondata)</li>\n" +
  "              </ul>\n" +
  "\n" +
  "              <p>\n" +
  "                <br />\n" +
  "                Bestillingsoplysninger videresendes til det bibliotek du har\n" +
  "                valgt.\n" +
  "                <br />\n" +
  "                &nbsp;\n" +
  "              </p>\n" +
  "\n" +
  "              <h3>Biblioteker, du selv vælger</h3>\n" +
  "\n" +
  "              <p>\n" +
  "                Bibliotek.dk gemmer også oplysninger om de biblioteker, du selv\n" +
  "                tilføjer. Du kan til hver en tid slette et eller flere af dine\n" +
  "                biblioteker fra din profil, eller du kan slette hele profilen.\n" +
  "                Sletter du din profil, bliver alle oplysninger om dig slettet.\n" +
  "              </p>\n" +
  "\n" +
  "              <h3>Huskeliste</h3>\n" +
  "\n" +
  "              <p>\n" +
  "                Bibliotek.dk gemmer også oplysninger om de poster, du lægger på\n" +
  "                din huskeliste. Du kan til hver en tid slette en eller flere\n" +
  "                poster fra huskelisten. Sletter du din profil, bliver alle\n" +
  "                oplysninger om din huskeliste slettet.\n" +
  "                <br />\n" +
  "                &nbsp;\n" +
  "              </p>\n" +
  "\n" +
  "              <h2>Dine rettigheder</h2>\n" +
  "\n" +
  "              <p>\n" +
  "                Jævnfør databeskyttelsesforordningen har du som bruger en række\n" +
  "                rettigheder, som vi her skal oplyse dig om.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Ret til at se oplysninger (indsigtsret)\n" +
  "                <br />\n" +
  "                Du har ret til at få indsigt i de oplysninger, som vi behandler\n" +
  "                om dig.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Ret til berigtigelse (rettelse)\n" +
  "                <br />\n" +
  "                Du har ret til at få urigtige oplysninger om dig selv rettet.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Ret til sletning\n" +
  "                <br />I særlige tilfælde har du ret til at få slettet\n" +
  "                oplysninger om dig, inden tidspunktet for vores almindelige\n" +
  "                generelle sletning indtræffer.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Ret til begrænsning af behandling\n" +
  "                <br />\n" +
  "                Du har i visse tilfælde ret til at få behandlingen af dine\n" +
  "                personoplysninger begrænset. Hvis du har ret til at få begrænset\n" +
  "                behandlingen, må vi fremover kun behandle oplysningerne –\n" +
  "                bortset fra opbevaring – med dit samtykke, eller med henblik på\n" +
  "                at retskrav kan fastlægges, gøres gældende eller forsvares,\n" +
  "                eller for at beskytte en person eller vigtige\n" +
  "                samfundsinteresser.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Ret til indsigelse\n" +
  "                <br />\n" +
  "                Du har i visse tilfælde ret til at gøre indsigelse mod vores\n" +
  "                egentlig lovlige behandling af dine personoplysninger. Du kan\n" +
  "                også gøre indsigelse mod behandling af dine oplysninger til\n" +
  "                direkte markedsføring.\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Du kan læse mere om dine rettigheder i Datatilsynets vejledning\n" +
  "                om de registreredes rettigheder, som du finder på\n" +
  "                <a\n" +
  '                  href="https://www.datatilsynet.dk"\n' +
  "target=_blank\n" +
  '                  className="animations_top_line_keep_false__eIwX_ animations_top_line_false__YkyKD animations_underlineContainer__ojbVD"\n' +
  "                >\n" +
  "                  datatilsynet.dk\n" +
  "                </a>\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Klage til Datatilsynet\n" +
  "                <br />\n" +
  "                Du har ret til at indgive en klage til Datatilsynet, hvis du er\n" +
  "                utilfreds med den måde, vi behandler dine personoplysninger på.\n" +
  "                Du finder Datatilsynets kontaktoplysninger på\n" +
  "                <a\n" +
  '                  href="https://www.datatilsynet.dk"\n' +
  "target=_blank\n" +
  '                  className="animations_top_line_keep_false__eIwX_ animations_top_line_false__YkyKD animations_underlineContainer__ojbVD"\n' +
  "                >\n" +
  "                  datatilsynet.dk\n" +
  "                </a>\n" +
  "              </p>\n" +
  "\n" +
  "              <p>\n" +
  "                Hvis du har spørgsmål til dine rettigheder, er du velkommen til\n" +
  "                at kontakte os:\n" +
  "                <a\n" +
  '                  href="https://kundeservice.dbc.dk/bibdk"\n' +
  "target=_blank\n" +
  '                  className="animations_top_line_keep_false__eIwX_ animations_top_line_false__YkyKD animations_underlineContainer__ojbVD"\n' +
  "                >\n" +
  "                  Kundeservice\n" +
  "                </a>\n" +
  "                <br />\n" +
  "                &nbsp;\n" +
  "              </p>\n" +
  "\n" +
  "              <p>&nbsp;</p>";

const Privatlivspolitik = () => {
  return (
    <>
      <Header />
      <main>
        <Head />
        <Section
          space={{ top: 100, bottom: 100 }}
          title="Privatlivspolitik, sådan håndterer vi dine data"
          divider={false}
        >
          <BodyParser body={txtBody} />
        </Section>
      </main>
    </>
  );
};

export default Privatlivspolitik;

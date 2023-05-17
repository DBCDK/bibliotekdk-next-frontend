import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import LibrariesTable from "../librariesTable/LibrariesTable";
import styles from "./myLibrariesPage.module.css";
import Button from "@/components/base/button";
const mockData = [
  {
    agency: "Biblioteket kilden",
    libraryName: "Herlev bibliotek",
    type: "Folkebibliotek",
  },
  {
    agency: null,
    libraryName: "Ballerup bibliotek",
    type: "Folkebibliotek",
  },
  {
    agency: "Biblioteket Danasvej",
    libraryName: "Biblioteket Frederiksberg",
    type: "Folkebibliotek",
  },
  {
    agency: "Københavns Universitetsbibliotek, Søndre Campus",
    libraryName: "Det Kgl. Bibliotek",
    type: "Uddannelsesbibliotek",
  },
];
/**
 * MyLibraries page React component
 *
 * @returns {JSX.Element}
 */

export default function MyLibrariesPage() {
  return (
    <Layout title={Translate({ context: "profile", label: "myLibraries" })}>
      <Button className={styles.addLibrary} type="secondary" size="small">
        {Translate({ context: "profile", label: "addLibrary" })}
      </Button>
      <LibrariesTable data={mockData} />
    </Layout>
  );
}

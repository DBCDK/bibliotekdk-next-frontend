import Translate from "@/components/base/translate/Translate";
import Layout from "../layout";

/**
 * MyLibraries page React component
 *
 * @returns {JSX.Element}
 */
export default function MyLibrariesPage() {
  return (
    <Layout title={Translate({ context: "profile", label: "myLibraries" })}>
      <p>hej med dig</p>
    </Layout>
  );
}

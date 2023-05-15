import Translate from "@/components/base/translate/Translate";
import ProfileLayout from "../profileLayout";

/**
 * MyLibraries page React component
 *
 * @returns {JSX.Element}
 */
export default function MyLibrariesPage() {
  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "myLibraries" })}
    >
      <p>hej med dig</p>
    </ProfileLayout>
  );
}

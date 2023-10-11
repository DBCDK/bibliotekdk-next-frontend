import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";

const InitialMaterialFilterPage = () => {
  return (<section>
    <Top
        title={"bemærk"}
        titleTag="h2"
      />
      <Text>x materialer findes online, og kræver ikke bestilling</Text>

      *list

      <Text>På næste side vises de x materialer, som du kan bestille</Text>
      <Button type="primary" size="large">Næste</Button>
  </section>);
}

export default InitialMaterialFilterPage; 
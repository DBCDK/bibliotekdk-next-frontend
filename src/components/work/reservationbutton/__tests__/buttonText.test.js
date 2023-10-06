import { Translate } from "@/components/base/translate";
import { constructButtonText } from "../utils";


describe("Button text generation", () => {
  it("Ebook - long", () => {
    const materialType = 'literature';
    const selectedMaterialType = 'e-bog'

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected = Translate({context: "overview", label: "material-action-read"}) + " " + Translate({context: "overview", label: "material-typename-ebook"}).toLowerCase();
    expect(actual).toEqual(expected);
  });

  it("Ebook - short", () => {
    const materialType = 'literature';
    const selectedMaterialType = 'e-bog'

    const actual = constructButtonText(materialType, selectedMaterialType, true);
    const expected = Translate({context: "overview", label: "material-action-read"}) + " " + Translate({context: "overview", label: "material-typename-ebook"}).toLowerCase();
    expect(actual).toEqual(expected);
  });
});
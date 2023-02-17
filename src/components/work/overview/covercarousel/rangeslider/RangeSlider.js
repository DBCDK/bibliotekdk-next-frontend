import styles from "@/components/work/overview/covercarousel/rangeslider/RangeSlider.module.css";

export default function RangeSlider({
  index,
  length,
  clickCallback,
  sliderClass = "",
}) {
  return (
    <input
      className={`${styles.input_range} ${sliderClass}`}
      type={"range"}
      min={0}
      max={length - 1}
      value={index}
      onInput={(event) => clickCallback(event.target.value)}
      onMouseMove={(e) => e.preventDefault()}
    />
  );
}

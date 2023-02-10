import styles from "@/components/work/overview/covercarousel/rangeslider/RangeSlider.module.css";

export default function RangeSlider({
  index,
  length,
  clickCallback,
  sliderClass = "",
}) {
  return (
    <input
      className={`${sliderClass} ${styles.input_range}`}
      type={"range"}
      min={0}
      max={length - 1}
      value={index}
      onChange={(event) => clickCallback(event.target.value)}
    />
  );
}

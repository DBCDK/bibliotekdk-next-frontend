import InfoDropdown from "@/components/base/infoDropdown/InfoDropdown";

export function CqlErrorMessage({ message }) {
  return (
    <div>
      <div>{message.explanation}</div>
      <div>{message.location}</div>
      <InfoDropdown buttonText="full error message" label="Full error">
        {message.full}
      </InfoDropdown>
    </div>
  );
}

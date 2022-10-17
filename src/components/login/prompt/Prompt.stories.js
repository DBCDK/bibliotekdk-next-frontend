import LoginPrompt from "./Prompt";

const exportedObject = {
  title: "login/Prompt",
};

export default exportedObject;

export function ShowLoginPrompt() {
  return (
    <LoginPrompt
      title="Få adgang til noget"
      description="Du skal lige logge ind først, så får du adgang til det hele."
      signIn={() => {}}
    />
  );
}

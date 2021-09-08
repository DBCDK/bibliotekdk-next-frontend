import LoginPrompt from "./Prompt";

export default {
  title: "login/Prompt",
};

export function ShowLoginPrompt() {
  return (
    <LoginPrompt
      title="Få adgang til noget"
      description="Du skal lige logge ind først, så får du adgang til det hele."
    />
  );
}

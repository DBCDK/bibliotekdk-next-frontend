// pages/avanceret/index.js
export async function getServerSideProps({ query }) {
  // Fjern 'mode' fra query så pathen er single source of truth
  const { mode, ...rest } = query;

  // Hvis der er en cql-param (også tom streng) ELLER mode=cql -> /find/cql
  const wantsCql = "cql" in query || mode === "cql";
  const destMode = wantsCql ? "cql" : "avanceret";

  const search = new URLSearchParams(rest).toString();

  return {
    redirect: {
      destination: `/find/${destMode}${search ? `?${search}` : ""}`,
      permanent: false,
    },
  };
}

export default function Redirecting() {
  return null;
}

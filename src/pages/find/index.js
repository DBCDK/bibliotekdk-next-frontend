// pages/find/index.js

export async function getServerSideProps(context) {
  const { query, resolvedUrl } = context;

  if (resolvedUrl === "/find" || resolvedUrl === "/find/") {
    const searchParams = new URLSearchParams(query).toString();
    return {
      redirect: {
        destination: `/find/simpel${searchParams ? `?${searchParams}` : ""}`,
        permanent: false,
      },
    };
  }

  return { notFound: true };
}

// ✅ Nødvendig default export – selvom den aldrig vises
export default function Redirecting() {
  return null;
}

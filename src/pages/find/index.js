// pages/find/index.js

export async function getServerSideProps(context) {
  const { req, query } = context;

  // Fanger fx både "/find" og "/find?q.all=ost"
  if (req.url?.startsWith("/find")) {
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

export default function Redirecting() {
  return null;
}

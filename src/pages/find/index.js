// pages/find/index.js

export async function getServerSideProps(context) {
  const { query, pathname } = context;

  // Redirect ONLY when path is exactly "/find"
  if (pathname === "/find") {
    const searchParams = new URLSearchParams(query).toString();

    return {
      redirect: {
        destination: `/find/simpel${searchParams ? `?${searchParams}` : ""}`,
        permanent: false,
      },
    };
  }

  // Prevent accessing this route any other way
  return { notFound: true };
}

export default function Redirecting() {
  return null;
}

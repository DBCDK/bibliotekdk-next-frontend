// Redirects from /avanceret to /find/avanceret, preserving any query parameters.
// If the query contains "cql", redirect to /find/cql instead.
// Supports legacy or simplified links pointing to the advanced search page.

export async function getServerSideProps(context) {
  const { query } = context;
  const searchParams = new URLSearchParams(query).toString();

  if ("cql" in query) {
    // Redirect to /find/cql if cql param is present
    return {
      redirect: {
        destination: `/find/cql${searchParams ? `?${searchParams}` : ""}`,
        permanent: false,
      },
    };
  }

  // Default: redirect to /find/avanceret
  return {
    redirect: {
      destination: `/find/avanceret${searchParams ? `?${searchParams}` : ""}`,
      permanent: false,
    },
  };
}

export default function Redirecting() {
  return null;
}

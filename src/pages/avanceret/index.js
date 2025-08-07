// Redirects from /avanceret to /find/avanceret, preserving any query parameters.
// Supports legacy or simplified links pointing to the advanced search page.

export async function getServerSideProps(context) {
  const { query } = context;
  const searchParams = new URLSearchParams(query).toString();

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

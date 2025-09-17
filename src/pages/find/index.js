// pages/find/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps({ query }) {
  const search = new URLSearchParams(query).toString();
  return {
    redirect: {
      destination: `/find/simpel${search ? `?${search}` : ""}`,
      permanent: false,
    },
  };
}

export default function Redirecting() {
  const router = useRouter();
  useEffect(() => {
    const search = new URLSearchParams(router.query).toString();
    router.replace(`/find/simpel${search ? `?${search}` : ""}`);
  }, [router]);
  return null;
}

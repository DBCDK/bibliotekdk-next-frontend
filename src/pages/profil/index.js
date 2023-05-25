import { useEffect } from "react";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";

function Profile() {
  const router = useRouter();

  useEffect(() => {
    //for now there is no /profil endpoint. /profil will redirect to /profil/laan-og-reserveringer
    router.replace("/profil/laan-og-reserveringer");
  }, []);
  return null;
}

export default Profile;

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Profile.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};

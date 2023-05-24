import { useEffect } from "react";
import { useRouter } from "next/router";

function Profile() {
  const router = useRouter();

  useEffect(() => {
    //for now there is no /profil endpoint. /profil will redirect to /profil/laan-og-reserveringer
    router.replace("/profil/laan-og-reserveringer");
  }, []);
  return null;
}

export default Profile;

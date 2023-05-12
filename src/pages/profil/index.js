import { useEffect } from "react";
import { useRouter } from "next/router";

function Profile() {
  const router = useRouter();

  useEffect(() => {
    //for now there is no /profil endpoint. /profil will redirect to /profil/mine-biblioteker
    router.replace("/profil/mine-biblioteker");
  }, []);
  return null;
}

export default Profile;

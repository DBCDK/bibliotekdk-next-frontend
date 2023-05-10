export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/profil/mine-biblioteker",
      permanent: true,
    },
  };
}

function Profile() {
  // This component won't be rendered because it's redirected
  return null;
}

export default Profile;

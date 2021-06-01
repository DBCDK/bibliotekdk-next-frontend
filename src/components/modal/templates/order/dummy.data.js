const work = {
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54829574&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=56be79c2c3242ad648cc",
  },
  title: "Ternet Ninja",
  creators: [{ name: "Anders Matthesen" }],
  manifestations: [
    { pid: "some-pid", materialType: "Bog" },
    { pid: "some-other-pid", materialType: "Bog" },
    { pid: "some-other-pid-2", materialType: "E-bog" },
  ],
};

// User props
const user = {
  name: "Låner Lånersen",
  agency: {
    name: "Hovedbiblioket",
    branches: [
      {
        branchId: "0",
        name: "Hovedbiblioteket",
        postalAddress: "Biblioteksvej 1",
        postalCode: "1234",
        city: "Biblioteksby",
      },
      {
        branchId: "1",
        name: "Filial 1",
        postalAddress: "Filialvej 1",
        postalCode: "1234",
        city: "Filialby",
      },
      {
        branchId: "2",
        name: "Filial 2",
        postalAddress: "Filialvej 2",
        postalCode: "1234",
        city: "Filialby",
      },
      {
        branchId: "3",
        name: "Filial 3",
        postalAddress: "Filialvej 3",
        postalCode: "1234",
        city: "Filialby",
      },
      {
        branchId: "4",
        name: "Filial 4",
        postalAddress: "Filialvej 4",
        postalCode: "1234",
        city: "Filialby",
      },
      {
        branchId: "5",
        name: "Filial 5",
        postalAddress: "Filialvej 5",
        postalCode: "1234",
        city: "Filialby",
      },
    ],
  },
};

// order
const order = {
  data: {},
  error: false,
  isLoading: false,
  isStory: true,
};

export default { work, user, order };

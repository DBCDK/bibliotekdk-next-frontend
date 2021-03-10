import { StoryTitle, StoryDescription } from "@/storybook";

import WorkSlider from "./WorkSlider";
export default {
  title: "base/Slider",
};

const works = [
  {
    creators: [
      {
        name: "Andrew Taylor (f. 1951)",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25007417&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=f989094a854e9cc93f9a",
    },
    description:
      "Kriminalroman. Da den aldrende enkemand Rufus bliver fundet død, lyder kendelsen på selvmord, men det er kriminalassistent Thornhill ikke tilfreds med. Han graver i sagen, som involverer mange personer, herunder hans egen kone Edith, da dødsfaldet viser sig at have tråde tilbage til mystiske dødsfald i 1938",

    id: "some-work-id-1",
    title: "Blodrøde spor - nu med meget lang titel ",
  },
  {
    creators: [
      {
        name: "Andrew Taylor (f. 1951)",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=22359169&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=74709a0239f1341d3263",
    },
    description:
      "Kriminalroman. En mand bliver fundet hængt i nærheden af den gamle markedsby Lydmouth. Kriminalassistent Thornhill sættes på sagen, og samtidig opdager en kvindelig journalist, at der er foregået mystiske ting på den skole, hvor den døde underviste",

    id: "some-work-id-2",
    title: "Galgetræet",
  },
  {
    creators: [
      {
        name: "Susan Hill",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=26940273&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=5b5151942b69ab39d1cf",
    },
    description:
      "Krimi, hvor kommissær Simon Serrailler skal opklare sagen om en irriterende ældre dame, der er forsvundet",

    id: "some-work-id-3",
    title: "Mørket i et hjerte",
  },
  {
    creators: [
      {
        name: "Alison G. Taylor",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24465845&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=907185d317b0fdca65a1",
    },
    description:
      "Kriminalroman. Kriminalkommissær McKenna skal løse mysteriet om en kvinde der er blevet fundet hængende bagbundet i en skov. Kvinden har hængt der i flere år, så identiteten er svær at finde frem til, og i lillebyen trives løgne og halve sandheder",

    id: "some-work-id-4",
    title: "Simeons brud - meget lang titel",
  },
  {
    creators: [
      {
        name: "P. D. James",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=27717861&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=d5f48b42fd7228a6d3a4",
    },
    description:
      "Krimi. Midt i sine lykkelige bryllupsplaner bliver Adam Dalgliesh kaldt til den eksklusive privatklinik for plastikkirurgi i Dorset, hvor skandalejournalisten Rhoda Gradwyn er blevet opereret - og nu er fundet myrdet",

    id: "some-work-id-5",
    title: "Ar for livet",
  },
  {
    creators: [
      {
        name: "Ruth Rendell",
      },
      {
        name: "Asta Smith-Hansen",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=28756674&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=4d36c639cc28e6f7da2c",
    },
    description:
      "Krimi med kommissær Wexford og hans makker Burden på sporet af historien bag fundet af to lig, der var gravet ned 11 og 8 år tidligere. Beboerne i den lille by Kingsmarkham har mange hemmeligheder, og nogle af dem er dystre",

    id: "some-work-id-6",
    title: "Ikke i kød og blod",
  },
  {
    creators: [
      {
        name: "John Creasey",
      },
      {
        name: "Vivi Berendt",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52088690&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=1c54ebf3c73fb3d55dd1",
    },
    description:
      "Krimi. Et skrig flænger luften, og kriminalinspektør West får øje på en kvinde, hvis spædbarn er blevet myrdet. Inden for tre døgn er der sket yderligere to barnemord i samme bydel samt trusler mod andre babyer",

    id: "some-work-id-7",
    title: "Uskyldige ofre",
  },
  {
    creators: [
      {
        name: "Peter Robinson (f. 1950)",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=26887585&attachment_type=forside_stor&bibliotek=870970&source_id=150074&key=960fee64ca411d446958",
    },
    description:
      "Krimi. To både bryder i brand på Eastvale-kanalen. Kriminalinspektørerne Alan Banks og Annie Cabbot finder hurtigt ud af, at branden er påsat, men hvem var det, der skulle dø ved branden?",

    id: "some-work-id-8",
    title: "Et spor af ild",
  },
  {
    creators: [
      {
        name: "P. D. James",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23945134&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=3ece3c4a79566833de77",
    },
    description:
      "Kriminalinspektør Dalgliesh, som opholder sig på ferie på et præsteseminarium i Suffolk, bliver indblandet som politimand, da den lokale provst bliver fundet myrdet i seminariets kirke. Flere mord følger, og Dalgliesh' team træder til",

    id: "some-work-id-9",
    title: "Gejstlig død",
  },
  {
    creators: [
      {
        name: "Peter Robinson (f. 1950)",
      },
    ],
    cover: {
      detail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=26455162&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3441d536acd944b1f38",
    },
    description:
      "Krimi, hvor chefkriminalinspektør Alan Banks får en sag, der drejer sig om hans egen ungdomsven, der forsvandt 40 år tidligere og hvis skelet pludselig dukker op",

    id: "some-work-id-10",
    title: "Alt for tæt på",
  },
];

export function Work_Slider() {
  return (
    <div>
      <StoryTitle>A work slider</StoryTitle>
      <StoryDescription>
        This component lets the user slide through a list of works
      </StoryDescription>
      <div>
        <br />
        Accessibility decisions:
        <ul style={{ marginLeft: 40 }}>
          <li>
            Prev/next buttons are clickable via mouse or touch only - they are
            not focusable
          </li>
          <li>Each card is focusable</li>
          <li>Slider will automatically scroll to card in focus</li>
        </ul>
      </div>

      <WorkSlider works={works} />
    </div>
  );
}

export function WorkSliderIndented() {
  return (
    <div>
      <StoryTitle>A work slider - indented</StoryTitle>
      <StoryDescription>
        Slider will detect if there is room to the left, and move the left arrow
        accordingly
      </StoryDescription>

      <div style={{ paddingLeft: 150 }}>
        <WorkSlider works={works} />
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>A work slider - skeleton</StoryTitle>
      <WorkSlider skeleton={true} />
    </div>
  );
}

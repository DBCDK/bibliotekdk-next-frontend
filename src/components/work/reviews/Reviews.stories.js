import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import { Reviews, ReviewsSkeleton } from "./Reviews.js";

import {
  MaterialReview,
  MaterialReviewSkeleton,
} from "./types/material/MaterialReview.js";

import {
  InfomediaReview,
  InfomediaReviewSkeleton,
} from "./types/infomedia/InfomediaReview.js";

import {
  LitteratursidenReview,
  LitteratursidenReviewSkeleton,
} from "./types/litteratursiden/LitteratursidenReview.js";

export default {
  title: "Work: Reviews",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

export function ReviewsSlider() {
  const data = [
    {
      __typename: "ReviewInfomedia",
      author: "Svend Svendsen",
      date: "2013-06-25",
      media: "Jyllandsposten",
      rating: "4/5",
      url: "http://",
    },
    {
      __typename: "ReviewLitteratursiden",
      author: "Didrik Pedersen",
      date: "2013-06-25",
      media: "",
      rating: "1/5",
      url: "http://",
    },
    {
      __typename: "ReviewMatVurd",
      author: "Svend Svendsen",
      date: "2013-06-25",
      all: [
        {
          text:
            "Romanen er Ninni SchuImans anden fritstående krimi om journalisten Magdalene og betjentene Petra og Christer. I den svenske sommervarme er en pyroman løs. En kvinde omkommer i flammerne og nu må politiet, sammen med journalisten Magdalene, forsøge at finde frem til gerningsmanden, inden der bliver begået flere mord. Bag det spinkle plot, som er meget utroværdigt selv inden for genrens rammer, er romanen en skildring af fortabte drømme, kærlighed og livet omkring de 40. Problemet er dog, at de to dele, krimien og hverdagsrealismen, aldrig bliver koblet ordenligt sammen, og så hæmmer det realismen voldsomt, at plottet ikke er troværdigt. Politifolkene fremstår eksempelvis unødvendigt inkompetente. Forfatteren formår dog at komme med fine miljøskildringer og et par enkelte fine karakterer, som hæver sig over det todimensionale og skabelonagtige",
        },
        {
          text:
            'Til den store læserskare af "nordiske krimier tilsat hverdagsrealisme". Der findes mange bedre krimier, der ligner Drengen der holdt op med at græde til forveksling',
        },
        {
          text:
            "Det er oplagt at sammenligne med Liza Marklund og Mari Jungstedt, der også benytter sig af makkerparret journalist/politimand",
        },
        {
          text:
            "Ordinær krimi, med fine miljøskildringer, hvor plottet dog virker forceret og utroværdigt, og det drukner de ellers fine tilløb til hverdagsrealisme. Der findes mange bedre skandinaviske krimier på markedet, som formår at koble det realistiske sammen med et veludført plot",
        },
      ],
      url: "http://",
    },
    {
      __typename: "ReviewInfomedia",
      date: "2013-06-25",
      author: "Didrik Pedersen",
      media: "Berlingske Tidende",
      rating: "5/5",
      url: "http://",
    },
    {
      __typename: "ReviewInfomedia",
      date: "2013-06-25",
      author: "Svend Svendsen",
      media: "Jyllandsposten",
      rating: "4/5",
      url: "http://",
    },
  ];

  return (
    <div>
      <StoryTitle>Anmeldesler</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <Reviews data={data} />
    </div>
  );
}

export function LoadingSlider() {
  return (
    <div>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        The loading/skeleton version of the review slider, uses the Infomedia
        template as skeleton elements.
      </StoryDescription>
      <ReviewsSkeleton />
    </div>
  );
}

export function Material() {
  const data = {
    author: "Svend Svendsen",
    media: "Jyllandsposten",
    rating: "4/5",
    reviewType: "MATERIALREVIEW",
    url: "http://",
  };
  return (
    <div>
      <div>
        <StoryTitle>MaterialReview template</StoryTitle>
        <StoryDescription>Material review example</StoryDescription>
        <div style={{ maxWidth: "1000px" }}>
          <MaterialReview data={data} />
        </div>
      </div>

      <StorySpace direction="v" space="3" />

      <div>
        <StoryTitle>Loading</StoryTitle>
        <StoryDescription>Loading Material review example</StoryDescription>
        <div style={{ maxWidth: "1000px" }}>
          <MaterialReviewSkeleton />
        </div>
      </div>
    </div>
  );
}

export function Infomedia() {
  const data = {
    author: "Svend Svendsen",
    media: "Jyllandsposten",
    rating: "4/5",
    reviewType: "INFOMEDIA",
    url: "http://",
  };
  return (
    <div>
      <div>
        <StoryTitle>Infomedia template</StoryTitle>
        <StoryDescription>Infomedia review example</StoryDescription>
        <InfomediaReview data={data} />
      </div>

      <StorySpace direction="v" space="3" />

      <div>
        <StoryTitle>Loading</StoryTitle>
        <StoryDescription>
          Skeleton/loading view of the infomedia review template
        </StoryDescription>
        <InfomediaReviewSkeleton />
      </div>
    </div>
  );
}

export function Litteratursiden() {
  const data = {
    author: "Svend Svendsen",
    reviewType: "INFOMEDIA",
    url: "http://",
  };
  return (
    <div>
      <div>
        <StoryTitle>Litteratursiden template</StoryTitle>
        <StoryDescription>Litteratursiden review example</StoryDescription>
        <LitteratursidenReview data={data} />
      </div>

      <StorySpace direction="v" space="3" />

      <div>
        <StoryTitle>Litteratursiden template</StoryTitle>
        <StoryDescription>Litteratursiden review example</StoryDescription>
        <LitteratursidenReviewSkeleton />
      </div>
    </div>
  );
}

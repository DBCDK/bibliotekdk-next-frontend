import ManifestationParts from "@/components/manifestationparts/ManifestationParts";

const exportedObject = {
  title: "work/ManifestationParts",
};

export default exportedObject;

export function ManifestationPartsStory() {
  const pid = "870970-basis:39533928";
  return <ManifestationParts pid={pid} />;
}

ManifestationPartsStory.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Manifestation: {
          manifestationParts: () => ({
            parts: [
              {
                title: "Enter Sandman (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "5:31 min",
              },
              {
                title: "Sad But True (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "5:24 min",
              },
              {
                title: "Holier Than Thou (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "3:47 min",
              },
              {
                title: "The Unforgiven (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "6:27 min",
              },
              {
                title: "Wherever I May Roam (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "6:44 min",
              },
              {
                title: "Don't Tread on Me (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "4:00 min",
              },
              {
                title: "Through the Never (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "4:04 min",
              },
              {
                title: "Nothing Else Matters (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "6:28 min",
              },
              {
                title: "Of Wolf and Man (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "4:16 min",
              },
              {
                title: "The God That Failed (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "5:08 min",
              },
              {
                title: "My Friend of Misery (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "6:49 min",
              },
              {
                title: "The Struggle Within (Remastered)",
                classifications: [],
                subjects: null,
                playingTime: "3:52 min",
              },
              {
                title: "Enter Sandman (From Kirk's Riff Tapes)",
                classifications: [],
                subjects: null,
                playingTime: "1:11 min",
              },
              {
                title: "Enter Sandman (May 13th, 1991 Rough Mix)",
                classifications: [],
                subjects: null,
                playingTime: "5:35 min",
              },
              {
                title: "Sad But True (July 12th, 1990 Demo)",
                classifications: [],
                subjects: null,
                playingTime: "5:11 min",
              },
              {
                title: "Holier Than Thou (August 13th, 1990 Demo)",
                classifications: [],
                subjects: null,
                playingTime: "3:48 min",
              },
              {
                title: "The Unforgiven (Pre-Production Rehearsal)",
                classifications: [],
                subjects: null,
                playingTime: "6:43 min",
              },
              {
                title:
                  "Wherever I May Roam (July 30th, 1990, Writing in Progress)",
                classifications: [],
                subjects: null,
                playingTime: "6:05 min",
              },
              {
                title: "Don't Tread on Me (August 13th, 1990 Demo)",
                classifications: [],
                subjects: null,
                playingTime: "3:58 min",
              },
              {
                title: "Through the Never (Take 53 - October 22nd, 1990)",
                classifications: [],
                subjects: null,
                playingTime: "4:13 min",
              },
              {
                title: "Nothing Else Matters (From James' Riff Tapes)",
                classifications: [],
                subjects: null,
                playingTime: "4:54 min",
              },
              {
                title: "Of Wolf and Man (June 2nd, 1991 Rough Mix)",
                classifications: [],
                subjects: null,
                playingTime: "4:18 min",
              },
              {
                title: "The God That Failed (August 31st, 1990 Demo)",
                classifications: [],
                subjects: null,
                playingTime: "4:44 min",
              },
              {
                title: "My Friend of Misery (Pre-Production Rehearsal)",
                classifications: [],
                subjects: null,
                playingTime: "6:23 min",
              },
              {
                title: "The Struggle Within (Take 12 - November 10th, 1990)",
                classifications: [],
                subjects: null,
                playingTime: "3:25 min",
              },
              {
                title: "Nothing Else Matters (Elevator Version)",
                classifications: [],
                subjects: null,
                playingTime: null,
              },
              {
                title:
                  "Enter Sandman (Live at Tushino Airfield, Moscow, Russia - September 28th, 1991)",
                classifications: [],
                subjects: null,
                playingTime: "5:21 min",
              },
              {
                title:
                  "Sad But True (Live at Day on the Green, Oakland, CA - October 12th, 1991)",
                classifications: [],
                subjects: null,
                playingTime: "5:38 min",
              },
              {
                title:
                  "Holier Than Thou (Live at L.C. Walker Arena, Muskegon, Michigan - November 1st, 1991)",
                classifications: [],
                subjects: null,
                playingTime: null,
              },
              {
                title:
                  "The Unforgiven (Live at Arco Arena, Sacramento, CA - January 11th, 1992)",
                classifications: [],
                subjects: null,
                playingTime: "7:31 min",
              },
              {
                title:
                  "Wherever I May Roam (Live at Day on the Green, Oakland, CA - October 12th, 1991)",
                classifications: [],
                subjects: null,
                playingTime: "6:57 min",
              },
              {
                title:
                  "Creeping Death (Live at Arco Arena, Sacramento, CA - January 11th, 1992)",
                classifications: [],
                subjects: null,
                playingTime: "8:03 min",
              },
              {
                title:
                  "Through the Never (Live at Arco Arena, Sacramento, CA - January 11th, 1992)",
                classifications: [],
                subjects: null,
                playingTime: "4:22 min",
              },
              {
                title:
                  "Nothing Else Matters (Live at Wembley Stadium, London, England - April 20th, 1992)",
                classifications: [],
                subjects: null,
                playingTime: "6:23 min",
              },
              {
                title:
                  "Of Wolf and Man (Live at Maimarktgelände, Mannheim, Germany - May 22nd, 1993)",
                classifications: [],
                subjects: null,
                playingTime: "4:16 min",
              },
              {
                title:
                  "For Whom the Bell Tolls (Live at Day on the Green, Oakland, CA - October 12th, 1991)",
                classifications: [],
                subjects: null,
                playingTime: "5:59 min",
              },
              {
                title:
                  "One (Live at Tushino Airfield, Moscow, Russia - September 28th, 1991)",
                classifications: [],
                subjects: null,
                playingTime: "8:14 min",
              },
              {
                title:
                  "Whiplash (Live at Tushino Airfield, Moscow, Russia - September 28th, 1991)",
                classifications: [],
                subjects: null,
                playingTime: "5:41 min",
              },
              {
                title:
                  "So What (Live at Maimarktgelände, Mannheim, Germany - May 22nd, 1993)",
                classifications: [],
                subjects: null,
                playingTime: "3:31 min",
              },
            ],
          }),
        },
      },
    },
  },
  nextRouter: {
    showInfo: true,
    pathname: "/",
    query: {},
  },
};
